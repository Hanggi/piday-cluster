import { Module } from "@nestjs/common";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawService } from "./withdraw.service";

@Module({
    imports:[],
    controllers:[WithdrawController],
    providers:[WithdrawService]
})
export class WithdrawModule{}