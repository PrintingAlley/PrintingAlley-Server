import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintShop]),
    ProductModule,
    PrintShopReviewModule,
  ],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
