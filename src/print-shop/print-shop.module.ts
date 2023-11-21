import { Module } from '@nestjs/common';
import { PrintShopController } from './print-shop.controller';
import { PrintShopService } from './print-shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { PrintShopReviewModule } from 'src/print-shop-review/print-shop-review.module';
import { UserModule } from 'src/user/user.module';
import { ViewLog } from 'src/entity/view-log.entity';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintShop, PrintShopReview, ViewLog]),
    PrintShopReviewModule,
    UserModule,
    TagModule,
  ],
  controllers: [PrintShopController],
  providers: [PrintShopService],
})
export class PrintShopModule {}
