import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintShop])],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
