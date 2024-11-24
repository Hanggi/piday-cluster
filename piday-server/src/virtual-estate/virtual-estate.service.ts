import { VirtualEstate, VirtualEstateListing } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { h3ToGeo, h3ToParent, kRing } from "h3-js";
import Redis from "ioredis";

import { Inject, Injectable } from "@nestjs/common";

import { ServiceException } from "../lib/exceptions/service-exception";
import { generateFlakeID } from "../lib/generate-id/generate-flake-id";
import { PrismaService } from "../lib/prisma/prisma.service";
import { ZERO_DECIMAL } from "../lib/prisma/utils/zerro-decimal";

interface VirtualEstateTx {
  virtualEstate: {
    count: (params: { where: Record<string, any> }) => Promise<number>;
  };
  rechargeRecords: {
    count: (params: { where: Record<string, any> }) => Promise<number>;
  };
}

export interface H3ClusterResult {
  count: number;
  mean: number;
  hexIds: string[];
}

@Injectable()
export class VirtualEstateService {
  constructor(
    private prisma: PrismaService,
    @Inject("REDIS_CLIENT") readonly redis: Redis,
  ) {}

  async getLatestVirtualEstates(
    size: number,
    page: number,
  ): Promise<{
    virtualEstates: VirtualEstate[];
    totalCount: number;
  }> {
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      include: {
        owner: true,
        listings: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        },
        transactions: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      take: +size,
      skip: +(page - 1) * size,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await this.prisma.virtualEstate.count();

    return { virtualEstates, totalCount };
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
        listings: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        },
        transactions: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
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

  // async getMintPrice(hexID?: string, userID?: string): Promise<number> {
  //   const totalCount = await this.prisma.virtualEstate.count();

  //   if (hexID && userID) {
  //     const centerLatLng = h3ToGeo(hexID);

  //     if (centerLatLng && centerLatLng[0] < -66.5) {
  //       const antarcticaVECount = await this.prisma.virtualEstate.count({
  //         where: {
  //           ownerID: userID,
  //           level: "ANTARCTICA",
  //         },
  //       });

  //       if (antarcticaVECount < 3) {
  //         return 0;
  //       }
  //     }
  //   }

  //   if (totalCount < 100000) {
  //     return 3.14;
  //   } else if (totalCount < 200000) {
  //     return 6.28;
  //   } else {
  //     return 9.42;
  //   }
  // }

  // getMintPrice 函数
  async getMintPrice(
    hexID: string, // 假设 hexID 是字符串
    userID?: string, // 假设 userID 是字符串
    tx?: VirtualEstateTx, // 数据库事务 tx
  ): Promise<{ level: string; mintPrice: number }> {
    let level = "UNKNOWN";
    const centerLatLng = h3ToGeo(hexID); // 返回经纬度数组
    let mintPrice = 3.14; // Genesis land default price

    if (!tx) {
      tx = this.prisma;
    }

    // 如果没有 userID，只处理土地的全局计数，不涉及用户相关的逻辑
    if (!userID) {
      const [genesisVECount, goldenVECount] = await Promise.all([
        tx.virtualEstate.count({
          where: { isGenesis: true },
        }),
        tx.virtualEstate.count({
          where: { level: "GOLDEN" },
        }),
      ]);

      if (centerLatLng && centerLatLng[0] < -66.5) {
        level = "ANTARCTICA";
        mintPrice = 0.5; // 没有 userID，南极土地固定价格
      } else if (genesisVECount < 30_000) {
        level = "GENESIS";
        mintPrice = 3.14;
      } else if (goldenVECount < 300_000) {
        level = "GOLDEN";
        mintPrice = 0.5; // 没有 userID，黄金土地固定价格
      } else {
        level = "SLIVER";
        mintPrice = 0.1;
      }

      return { level, mintPrice };
    }

    // 获取需要的count数据
    const [
      myAntarcticaVECount,
      genesisVECount,
      goldenVECount,
      userGoldenVECount,

      mintAntarcticaVECount,
      mintGoldenVECount,
    ] = await Promise.all([
      tx.virtualEstate.count({
        where: { ownerID: userID, level: "ANTARCTICA" },
      }),
      tx.virtualEstate.count({ where: { isGenesis: true } }),
      tx.virtualEstate.count({ where: { level: "GOLDEN" } }),
      tx.virtualEstate.count({ where: { ownerID: userID, level: "GOLDEN" } }),

      // my mint records
      tx.rechargeRecords.count({
        where: {
          ownerID: userID,
          reason: "MINT_ANTARCTICA_VIRTUAL_ESTATE",
        },
      }),
      tx.rechargeRecords.count({
        where: {
          ownerID: userID,
          reason: "MINT_GOLDEN_VIRTUAL_ESTATE",
        },
      }),
    ]);

    // Check if the virtual estate is in the Antarctica region
    if (centerLatLng && centerLatLng[0] < -66.5) {
      level = "ANTARCTICA";
      mintPrice =
        myAntarcticaVECount >= 3 || mintAntarcticaVECount >= 3 ? 0.5 : 0;
    } else if (genesisVECount < 30_000) {
      level = "GENESIS";
      mintPrice = 3.14;
    } else if (goldenVECount < 300_000) {
      level = "GOLDEN";
      mintPrice = userGoldenVECount >= 3 || mintGoldenVECount >= 3 ? 0.5 : 0;
    } else {
      level = "SLIVER";
      mintPrice = 0.1;
    }

    return { level, mintPrice };
  }

  async mintVirtualEstate({
    userID,
    hexID,
    name,
  }: {
    userID: string;
    hexID: string; // H3 Hexagon ID in depth 12
    name: string;
  }): Promise<VirtualEstate> {
    return this.prisma.$transaction(async (tx) => {
      // Check if the user has enough balance to mint a virtual estate
      const balance = await tx.rechargeRecords.aggregate({
        where: {
          ownerID: userID,
        },
        _sum: {
          amount: true,
        },
      });

      const { level, mintPrice } = await this.getMintPrice(hexID, userID, tx);

      if (
        mintPrice > 0 &&
        (!balance._sum.amount ||
          balance._sum.amount.lessThan(new Decimal(mintPrice)))
      ) {
        throw new ServiceException("Not enough balance", "NOT_ENOUGH_BALANCE");
      }

      // Count the total number of virtual estates except the Antarctica region
      let veCount;
      if (level == "ANTARCTICA") {
        veCount = await tx.virtualEstate.count({
          where: {
            level: "ANTARCTICA",
          },
        });
      } else {
        veCount = await tx.virtualEstate.count({
          where: {
            level: {
              not: "ANTARCTICA",
            },
          },
        });
      }

      // Create a virtual estate with the given hexID and the ownerID
      const virtualEstatePromise = tx.virtualEstate.create({
        data: {
          name: (veCount + 1).toString() + name,
          // VirtualEstateID is a unique identifier for a virtual estate,
          // it's generated by H3HexagonLayer with the resolution of 12
          virtualEstateID: hexID,

          lastPrice: mintPrice,
          isGenesis: level == "GENESIS",
          level,

          ownerID: userID,
        },
      });

      const transactionID = BigInt(generateFlakeID());

      let reason = "MINT_VIRTUAL_ESTATE";
      if (level == "ANTARCTICA") {
        reason = "MINT_ANTARCTICA_VIRTUAL_ESTATE";
      } else if (level == "GOLDEN") {
        // // Stop GOLDEN mint for now
        // throw new ServiceException(
        //   "Golden virtual estate minting is disabled",
        //   "GOLDEN_MINT_DISABLED",
        // );

        reason = "MINT_GOLDEN_VIRTUAL_ESTATE";
      }

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

          reason: reason || "MINT_VIRTUAL_ESTATE",
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

      // TODO(Hanggi): Share profit with the inviter for 10%.
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

  // This function is returning the clusters in the area (H3 Cluster)
  async getClustersInArea({ hexID, depth }: { hexID: string; depth: number }) {
    // let h3CenterIndex = hexID;

    let clusterDepth: string = "depth2Index";

    if (depth <= 2) {
      clusterDepth = "depth2Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 2);
    } else if (depth <= 4) {
      clusterDepth = "depth4Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 4);
    } else if (depth <= 6) {
      clusterDepth = "depth6Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 6);
    } else if (depth <= 8) {
      clusterDepth = "depth8Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 8);
    } else if (depth <= 10) {
      clusterDepth = "depth10Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 10);
    } else if (depth <= 15) {
      clusterDepth = "depth10Index";
      // h3CenterIndex = h3ToParent(h3CenterIndex, 10);
    }

    const redisKey = `piday-server::clustersInArea:${clusterDepth}`;
    try {
      const clusterCache = await this.redis.get(redisKey);

      if (clusterCache) {
        return JSON.parse(clusterCache);
      }
    } catch (error) {
      console.error("Redis get error on H3 cluster", error);
    }

    const self = this;
    const hexCounts = await this.prisma.virtualEstate.groupBy({
      by: [clusterDepth as keyof typeof self.prisma.virtualEstate.fields], // 按 depth2Index 分组
      // where: {
      //   [clusterDepth]: {
      //     in: hexIDsInArea,
      //   },
      // },
      _count: {
        [clusterDepth]: true,
      },
    });

    const groupedByCount: { [key: number]: string[] } = {};

    hexCounts.forEach((hexCount) => {
      const count = hexCount._count[clusterDepth];
      const hexID = hexCount[clusterDepth];

      if (!groupedByCount[count]) {
        groupedByCount[count] = [];
      }
      groupedByCount[count].push(hexID);
    });

    const result: H3ClusterResult[] = Object.entries(groupedByCount).map(
      ([count, hexIds]) => ({
        count: Number(count), // 将 count 转换为数字
        mean: Number(count),
        hexIds,
      }),
    );

    try {
      await this.redis.set(redisKey, JSON.stringify(result), "EX", 60 * 60); // 1 hour
    } catch (error) {
      console.error("Redis set error on H3 cluster", error);
    }

    return result;
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

  async getListedVirtualEstates(page: number, size: number, sort: string) {
    const sortOptions = {
      LATEST: { createdAt: "desc" },
      LOWEST_PRICE: { lastPrice: "asc" },
      HIGHEST_PRICE: { lastPrice: "desc" },
    };

    const listings = await this.prisma.virtualEstateListing.findMany({
      where: {
        expiresAt: {
          gt: new Date(), // Only include listings that haven't expired
        },
      },
      orderBy: sortOptions[sort] || sortOptions.LATEST,
      distinct: ["virtualEstateID"], // Only get the latest listing per estate
    });

    // Extract the virtualEstateIDs in the order of the latest listings
    const virtualEstateIDs = listings.map((listing) => listing.virtualEstateID);

    // Calculate the number of items to skip based on the current page and page size
    const skip = +(page == 0 ? 0 : page - 1) * size;

    const estates = await this.prisma.virtualEstate.findMany({
      where: {
        virtualEstateID: {
          in: virtualEstateIDs,
        },
      },
      orderBy: sortOptions[sort] || sortOptions.LATEST,
      skip: +skip, // Skip the number of records based on the page
      take: +size, // Limit the number of records returned to the page size
    });

    const sortedEstates = estates.sort(
      (a, b) =>
        virtualEstateIDs.indexOf(a.virtualEstateID) -
        virtualEstateIDs.indexOf(b.virtualEstateID),
    );

    const totalCount = virtualEstateIDs.length;

    return { virtualEstateListingsActive: sortedEstates, totalCount };
  }

  async getTransactedVirtualEstates(page: number, size: number, sort: string) {
    const sortOptions = {
      LATEST: { createdAt: "desc" },
      LOWEST_PRICE: { price: "asc" },
      HIGHEST_PRICE: { price: "desc" },
    };

    // If 1 month is not enough, increase it.
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    // Fetch all unique transactions sorted
    const allTransactions =
      await this.prisma.virtualEstateTransactionRecords.findMany({
        where: {
          sellerID: {
            not: process.env.PLATFORM_ACCOUNT_ID,
          },
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: sortOptions[sort] || sortOptions.LATEST,
        select: {
          virtualEstateID: true,
        },
        distinct: ["virtualEstateID"],
      });

    // Extract unique virtual estate IDs while maintaining order
    const uniqueEstateIDs = Array.from(
      new Set(allTransactions.map((t) => t.virtualEstateID)),
    );

    // Paginate the unique virtual estate IDs
    const paginatedEstateIDs = uniqueEstateIDs.slice(
      (page - 1) * size,
      page * size,
    );

    // Fetch the virtual estates for the paginated IDs
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      where: {
        virtualEstateID: {
          in: paginatedEstateIDs,
        },
      },
      include: {
        listings: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        },
        transactions: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });

    // Maintain the order of virtual estates as per the paginated estate IDs
    const orderedVirtualEstates = paginatedEstateIDs.map((id) =>
      virtualEstates.find((estate) => estate.virtualEstateID === id),
    );

    // Count total transactions for pagination
    const totalCount = uniqueEstateIDs.length;

    return { virtualEstates: orderedVirtualEstates, totalCount };
  }

  async searchVirtualEstate(page: number, size: number, name: string) {
    const virtualEstates = await this.prisma.virtualEstate.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        listings: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        },
        transactions: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      take: +size,
      skip: +(page == 0 ? 0 : page - 1) * size,
      orderBy: {
        createdAt: "desc",
      },
    });

    return virtualEstates;
  }
}
