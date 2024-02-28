import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { SortByOptions, OrderByOptions } from "../dto/admin.dto";
import { UserAdminService } from "./user-admin.service";
import {Response} from 'express'
@Controller('admin/user')
export class UserAdminController{

    constructor(
        private readonly userAdminService:UserAdminService,
      ) {}
    @Get()
  // TODO(Hanggi): Add admin guard
  // @UseGuards()
  async getMyVirtualEstates(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('sort') sort: SortByOptions = SortByOptions.CREATED_AT,
    @Query('orderBy') orderBy: OrderByOptions = OrderByOptions.DESC,
    @Query('email') email?: string,
    @Query('username') username?: string,
    @Query('piAddress') piAddress?: string,

  ) {
    try {
      const userResponse =  await this.userAdminService.getAllUsers(  
        page,
        size,
        sort,
        orderBy,
        email,
        username,
        piAddress)
      
        if (!userResponse.user) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            virtualEstates: null,
            message: "No users found",
          });
        }

        res.status(HttpStatus.OK).json({
         user:userResponse.user,
          totalCount: userResponse.totalCount,
          success: true,
          message: "Users found successfully",
        });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}