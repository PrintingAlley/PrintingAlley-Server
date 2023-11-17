import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { ProductReviewModule } from 'src/product-review/product-review.module';
import { ViewLog } from 'src/entity/view-log.entity';
import { ProductReview } from 'src/entity/product-review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      PrintShop,
      Tag,
      ProductReview,
      ViewLog,
    ]),
    BookmarkModule,
    ProductReviewModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
