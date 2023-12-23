import { Decimal } from "@prisma/client/runtime/library";

import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "../lib/prisma/prisma.service";
import { VirtualEstateService } from "./virtual-estate.service";

describe("YourService", () => {
  let service: VirtualEstateService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualEstateService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue({
        virtualEstate: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
          create: jest.fn(),
        },
        rechargeRecords: {
          aggregate: jest.fn(),
        },
        virtualEstateTransactionRecords: {
          create: jest.fn(),
        },
        $transaction: jest.fn(),
      })
      .compile();

    service = module.get<VirtualEstateService>(VirtualEstateService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should return a list of virtual estates for a given user", async () => {
    const userId = "user123";
    const mockVirtualEstates = [
      {
        virtualEstateID: "estate1",
        lastPrice: new Decimal(10),
        ownerID: userId,
        id: 1,
        address: "0x123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        virtualEstateID: "estate2",
        lastPrice: new Decimal(20),
        ownerID: userId,
        id: 2,
        address: "0x123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest
      .spyOn(prismaService.virtualEstate, "findMany")
      .mockResolvedValue(mockVirtualEstates);

    const result = await service.getAllVirtualEstatesForSignedUser(
      userId,
      10,
      1,
    );

    expect(result).toEqual(mockVirtualEstates);
    expect(prismaService.virtualEstate.findMany).toHaveBeenCalledWith({
      where: { ownerID: userId },
      include: { owner: true },
      take: 10,
      skip: 0,
    });
  });

  it("should return a single virtual estate for a given hexID", async () => {
    const hexID = "ff88abcd";
    const mockVirtualEstate = {
      virtualEstateID: hexID,
      lastPrice: new Decimal(10),
      ownerID: "user123",
      id: 1,
      address: "0x123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest
      .spyOn(prismaService.virtualEstate, "findFirst")
      .mockResolvedValue(mockVirtualEstate);

    const result = await service.getOneVirtualEstate(hexID);

    expect(result).toEqual(mockVirtualEstate);
    expect(prismaService.virtualEstate.findFirst).toHaveBeenCalledWith({
      where: { virtualEstateID: hexID },
      include: { owner: true },
    });
  });

  it("should mint a virtual estate for a given user", async () => {
    const userId = "user123";
    const hexID = "ff88abcd";
    const mockVirtualEstate = {
      virtualEstateID: hexID,
      lastPrice: new Decimal(10),
      ownerID: userId,
      id: 1,
      address: "0x123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest
      .spyOn(prismaService.virtualEstate, "create")
      .mockResolvedValue(mockVirtualEstate);

    await service.mintVirtualEstate({ userID: userId, hexID });

    expect(prismaService.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  // it("should throw an error if the user does not have enough balance", async () => {
  //   const userID = "test-user-id";
  //   const hexID = "test-hex-id";
  //   const insufficientBalance = new Decimal(0); // 假设的余额，低于所需金额

  //   // 模拟 Prisma 查询余额返回不足的结果
  //   jest.spyOn(prismaService.rechargeRecords, "aggregate").mockResolvedValue({
  //     _sum: {
  //       amount: insufficientBalance,
  //     },
  //     _count: {}, // 添加额外必需的属性，如果需要的话可以赋予具体的值
  //     _avg: {}, // 同上
  //     _min: {}, // 同上
  //     _max: {}, // 同上
  //   });

  //   // 调用函数并期待抛出错误
  //   await expect(service.mintVirtualEstate({ userID, hexID })).rejects.toThrow(
  //     "Not enough balance",
  //   );
  // });
  it("should throw an error if the user does not have enough balance", async () => {
    const userID = "some-user-id";
    const hexID = "some-hex-id";
    const insufficientBalance = new Decimal(0); // 假设的余额，低于所需金额

    // 模拟用户余额不足的情况
    jest.spyOn(prismaService.rechargeRecords, "aggregate").mockResolvedValue({
      _sum: {
        amount: insufficientBalance, // 假设用户余额为 0
      },
      _count: {}, // 添加额外必需的属性，如果需要的话可以赋予具体的值
      _avg: {}, // 同上
      _min: {}, // 同上
      _max: {}, // 同上
    });

    // 模拟事务处理
    jest
      .spyOn(prismaService, "$transaction")
      .mockImplementation(async (cb) => cb(prismaService));

    // 测试用户余额不足时的行为
    await expect(service.mintVirtualEstate({ userID, hexID })).rejects.toThrow(
      "Not enough balance",
    );
  });
});
