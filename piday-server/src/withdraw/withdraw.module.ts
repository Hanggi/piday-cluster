import { Module } from "@nestjs/common";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawService } from "./withdraw.service";
import { PrismaService } from "../lib/prisma/prisma.service";

@Module({
    imports:[],
    controllers:[WithdrawController],
    providers:[WithdrawService , PrismaService]
})
export class WithdrawModule{}