import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Tag } from 'src/entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintShop, Tag])],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
