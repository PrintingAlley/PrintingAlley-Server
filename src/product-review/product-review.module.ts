import { Module } from '@nestjs/common';
import { ProductReviewController } from './product-review.controller';
import { ProductReviewService } from './product-review.service';
import { ProductReview } from 'src/entity/product-review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview])],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
  exports: [ProductReviewService],
})
export class ProductReviewModule {}
