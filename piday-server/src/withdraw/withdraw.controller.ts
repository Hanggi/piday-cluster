import { Body, Controller, Post } from "@nestjs/common";
import { WithdrawService } from "./withdraw.service";
import { Request, Response } from "express";
import { CreateWithdrawRequestDTO } from "./dto/createWithdrawRequest.dto";

@Controller('withdraw')
export class WithdrawController{
    constructor(private readonly withdrawService:WithdrawService){}

    @Post("create-request")
    async createWithdrawRequest(res:Response , req:Request , 
        @Body() body: CreateWithdrawRequestDTO,
        ){

    }
}