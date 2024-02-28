import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';
import { OrderByOptions, SortByOptions } from './dto/admin.dto';
import { VirtualEstate } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async getAllUsers(
        page:number , 
        size:number ,
        sort?: SortByOptions ,
        order?: OrderByOptions ,
        email?: string,
        username?: string,
        piAddress?: string, )
        {
        const query = {  };

          if (email) query['email'] = { contains: `%${email}%` };
          if (username) query['username'] = { contains: `%${username}%` };
          if (piAddress) query['piAddress'] = { contains: `%${piAddress}%` };
          let orderObj = {};
          if (sort && order) {
              orderObj[sort] = order;
          }
      
          const user = await this.prisma.user.findMany({
            where: query,
            take: +size,
            skip: +((page===0? 1 : page - 1) * size),
            orderBy: orderObj,
          });
      
          const totalCount = await this.prisma.user.count({
            where: query,
          });
      
          return { user, totalCount: totalCount };
    }

    async getAllVirtualEstates(
        size: number,
        page: number,
      ): Promise<{ myVirtualEstates: VirtualEstate[]; totalCount: number }> {
    
        const virtualEstates = await this.prisma.virtualEstate.findMany({
          include: {
            owner: true,
          },
          take: +size,
          skip: +(page - 1) * size,
        });
    
        const totalCount = await this.prisma.virtualEstate.count({
        });
    
        return { myVirtualEstates: virtualEstates, totalCount: totalCount };
      }

      
}
