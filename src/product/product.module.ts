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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, PrintShop, Tag]),
    BookmarkModule,
    ProductReviewModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
