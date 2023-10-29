import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintShopReviewController } from './print-shop-review.controller';
import { PrintShopReviewService } from './print-shop-review.service';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintShopReview])],
  controllers: [PrintShopReviewController],
  providers: [PrintShopReviewService],
  exports: [PrintShopReviewService],
})
export class PrintShopReviewModule {}
