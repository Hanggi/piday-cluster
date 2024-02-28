import { Controller, Get, HttpException, HttpStatus, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { plainToInstance } from 'class-transformer';
import { AuthenticatedRequest } from '../lib/keycloak/interfaces/authenticated-request';
import { KeycloakJwtGuard } from '../lib/keycloak/keycloak-jwt.guard';
import { VirtualEstateResponseDto } from '../virtual-estate/dto/virtual-estate.dto';
import { OrderByOptions, SortByOptions } from './dto/admin.dto';
import { Response } from "express";
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  // @UseGuards(KeycloakJwtGuard)
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
      const userResponse =  await this.adminService.getAllUsers(  
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

  @Get('virtual-estates')
  // @UseGuards(KeycloakJwtGuard)
  async getVirtualEstates(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query("page") page = 1, // default to page 1
    @Query("size") size = 10, //default to size 10,
  ) {
    try {
      const virtualEstatesRes =
        await this.adminService.getAllVirtualEstates(
          size,
          page,
        );

      if (!virtualEstatesRes.myVirtualEstates) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          virtualEstates: null,
          message: "No virtual estates found by this user",
        });
      }

      res.status(HttpStatus.OK).json({
        virtualEstates: plainToInstance(
          VirtualEstateResponseDto,
          virtualEstatesRes.myVirtualEstates,
          {
            excludeExtraneousValues: true,
          },
        ),
        totalCount: virtualEstatesRes.totalCount,
        success: true,
        message: "Virtual states found successfully",
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
