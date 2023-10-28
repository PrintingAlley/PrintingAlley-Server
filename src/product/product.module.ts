import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { ProductReviewModule } from 'src/product-review/product-review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, PrintShop, Tag, Bookmark]),
    ProductReviewModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
