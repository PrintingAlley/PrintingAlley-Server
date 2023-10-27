import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, PrintShop, Tag, Bookmark]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
