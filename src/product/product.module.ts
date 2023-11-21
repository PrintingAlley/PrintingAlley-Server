import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { ProductReviewModule } from 'src/product-review/product-review.module';
import { ViewLog } from 'src/entity/view-log.entity';
import { ProductReview } from 'src/entity/product-review.entity';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      PrintShop,
      ProductReview,
      ViewLog,
    ]),
    BookmarkModule,
    ProductReviewModule,
    TagModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
