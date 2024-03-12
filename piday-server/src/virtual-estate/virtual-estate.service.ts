import { VirtualEstate, VirtualEstateListing } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { kRing } from "h3-js";

import { Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { ZERO_DECIMAL } from "../lib/prisma/utils/zerro-decimal";

@Injectable()
export class VirtualEstateService {
  constructor(private prisma: PrismaService) {}

  async getLatestVirtualEstates(
    size: number,
    page: number,
  ): Promise<VirtualEstate[]> {
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      include: {
        owner: true,
      },
      take: +size,
      skip: +(page - 1) * size,
      orderBy: {
        createdAt: "desc",
      },
    });

    return virtualEstates;
  }

  async getOneVirtualEstate(
    hexID: string,
    optional: {
      withListing: boolean;
    } = {
      withListing: false,
    },
  ): Promise<{ ve: VirtualEstate; listing: VirtualEstateListing }> {
    const virtualEstate = await this.prisma.virtualEstate.findFirst({
      where: {
        virtualEstateID: hexID,
      },
      include: {
        owner: true,
      },
    });

    let listing = null;
    if (optional.withListing) {
      // Get listing for the virtual estate
      listing = await this.prisma.virtualEstateListing.findFirst({
        where: {
          virtualEstateID: hexID,
          type: "ASK",
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    }

    return { ve: virtualEstate, listing };
  }

  async getAllVirtualEstatesForSignedUser(
    userId: string,
    size: number,
    page: number,
  ): Promise<{ myVirtualEstates: VirtualEstate[]; totalCount: number }> {
    const query = {
      ownerID: userId,
    };

    const virtualEstates = await this.prisma.virtualEstate.findMany({
      where: query,
      include: {
        owner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: +size,
      skip: +(page - 1) * size,
    });

    const totalCount = await this.prisma.virtualEstate.count({
      where: query,
    });

    return { myVirtualEstates: virtualEstates, totalCount: totalCount };
  }

  async getMintPrice(): Promise<number> {
    const totalCount = await this.prisma.virtualEstate.count();

    if (totalCount < 100000) {
      return 3.14;
    } else if (totalCount < 200000) {
      return 6.28;
    } else {
      return 9.42;
    }
  }

  async mintVirtualEstate({
    userID,
    hexID,
    name,
  }: {
    userID: string;
    hexID: string;
    name: string;
  }): Promise<VirtualEstate> {
    return this.prisma.$transaction(async (tx) => {
      const balance = await tx.rechargeRecords.aggregate({
        where: {
          ownerID: userID,
        },
        _sum: {
          amount: true,
        },
      });

      const mintPrice = await this.getMintPrice();

      if (balance._sum.amount.lessThan(new Decimal(mintPrice))) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      // TODO(Hanggi): Share profit with the inviter for 10%.

      const veCount = await tx.virtualEstate.count();

      // Create a virtual estate with the given hexID and the ownerID
      const virtualEstatePromise = tx.virtualEstate.create({
        data: {
          name: (veCount + 1).toString() + name,
          // VirtualEstateID is a unique identifier for a virtual estate,
          // it's generated by H3HexagonLayer with the resolution of 12
          virtualEstateID: hexID,

          lastPrice: mintPrice,
          isGenesis: veCount < 314_000,

          ownerID: userID,
        },
      });

      const transactionID = BigInt(generateFlakeID());

      // Create a transaction record for the minting
      const transactionRecordPromise =
        tx.virtualEstateTransactionRecords.create({
          data: {
            virtualEstateID: hexID,
            transactionID: transactionID,

            price: mintPrice,

            buyerID: userID,
            sellerID: process.env.PLATFORM_ACCOUNT_ID,
          },
        });

      // Create a recharge record for the minting
      const rechargeRecordPromise = tx.rechargeRecords.create({
        data: {
          amount: -mintPrice,
          externalID: transactionID.toString(),

          reason: "MINT_VIRTUAL_ESTATE",
          ownerID: userID,
        },
      });

      // Get the user inviter and share the profit with the inviter
      // TODO(Hanggi): Only select the inviterID.
      const myUser = await tx.user.findUnique({
        where: {
          keycloakID: userID,
        },
      });
      let platformIncome = mintPrice;

      if (myUser.inviterID) {
        const inviter = await tx.user.findUnique({
          where: {
            id: myUser.inviterID,
          },
        });

        const inviterProfit =
          mintPrice * +process.env.INVITER_MINT_REWARD_RATIO;
        platformIncome -= inviterProfit;
        await tx.rechargeRecords.create({
          data: {
            amount: inviterProfit,
            externalID: transactionID.toString(),

            reason: "INVITER_PROFIT",
            ownerID: inviter.keycloakID,
          },
        });
      }

      const createMintRechargeRecordForPlatform = tx.rechargeRecords.create({
        data: {
          amount: platformIncome,
          externalID: transactionID.toString(),

          reason: "PLATFORM_MINT_VIRTUAL_ESTATE",
          ownerID: process.env.PLATFORM_ACCOUNT_ID,
        },
      });

      const [virtualEstate] = await Promise.all([
        virtualEstatePromise,
        transactionRecordPromise,
        rechargeRecordPromise,
        createMintRechargeRecordForPlatform,
      ]);

      return virtualEstate;
    });
  }

  async getHexIDsStatusInArea({
    hexID,
  }: {
    hexID: string;
  }): Promise<{ onSale: string[]; sold?: string[] }> {
    const hexIDsInArea = kRing(hexID, 15).map((hex) => {
      return hex;
    });
    const virtualEstatesHasOwner = await this.prisma.virtualEstate.findMany({
      select: {
        virtualEstateID: true, // 只选择 id 字段
      },
      where: {
        virtualEstateID: {
          in: hexIDsInArea,
        },
      },
    });

    return {
      onSale: [],
      sold: virtualEstatesHasOwner.map((ve) => ve.virtualEstateID) || [],
    };
  }

  async getVirtualEstateTotalMinted(
    endDate: Date,
    startDate: Date,
  ): Promise<number> {
    try {
      const virtualEstateMinted = await this.prisma.virtualEstate.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      return virtualEstateMinted;
    } catch (error) {
      throw error;
    }
  }

  async transferVirtualEstate(
    hexID: string,
    receiverID: string,
    ownerID: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const virtualEstate = await tx.virtualEstate.findUnique({
        where: {
          virtualEstateID: hexID,
        },
      });
      if (virtualEstate.ownerID !== ownerID)
        throw new ServiceException("Not owns this virtual estate", "NOT_OWNER");

      const receiver = await tx.user.findUnique({
        where: {
          keycloakID: receiverID,
        },
      });

      if (!receiver)
        throw new ServiceException("user does not exist", "USER_NOT_FOUND");

      await tx.virtualEstate.update({
        data: {
          ownerID: receiver.keycloakID,
        },
        where: {
          virtualEstateID: hexID,
        },
      });
      const transactionID = BigInt(generateFlakeID());
      const transaction = await tx.virtualEstateTransactionRecords.create({
        data: {
          transactionID: transactionID,
          buyerID: receiver.keycloakID,
          price: ZERO_DECIMAL,
          sellerID: ownerID,
          virtualEstateID: virtualEstate.virtualEstateID,
        },
      });

      // Expires all the listing for the virtual estate
      await tx.virtualEstateListing.updateMany({
        where: {
          virtualEstateID: hexID,
        },
        data: {
          expiresAt: new Date(),
        },
      });

      return {
        ...transaction,
        transactionID: transaction.transactionID.toString(),
      };
    });
  }

  async getListedVirtualEstates(page: number, size: number) {
    const virtualEstateListingsActive =
      await this.prisma.virtualEstate.findMany({
        where: {
          listings: {
            some: {
              expiresAt: {
                gt: new Date(), // Check if the expiration date is in the future
              },
            },
          },
        },
        include: {
          listings: true,
        },
        take: +size,
        skip: +(page == 0 ? 0 : page - 1) * size,
        orderBy: {
          createdAt: "desc",
        },
      });

    return virtualEstateListingsActive;
  }
}
