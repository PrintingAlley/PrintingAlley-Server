import { ApiProperty } from '@nestjs/swagger';
import { SimpleCategorySwaggerDto } from 'src/category/dto/swagger/simple-category.swagger.dto';
import { SimplePrintShopSwaggerDto } from 'src/print-shop/dto/swagger/simple-print-shop.swagger.dto';
import { SimpleTagSwaggerDto } from 'src/tag/dto/swagger/simple-tag.swagger.dto';
import { SimpleProductSwaggerDto } from './simple-product.swagger.dto';
import { SimpleProductReviewSwaggerDto } from 'src/product-review/dto/swagger/simple-product-review.swagger.dto';

export class ProductSwaggerDto extends SimpleProductSwaggerDto {
  @ApiProperty({
    description: '태그 목록',
    type: [SimpleTagSwaggerDto],
  })
  tags: SimpleTagSwaggerDto[];
}

export class ProductListSwaggerDto {
  @ApiProperty({
    description: '제품 목록',
    type: [ProductSwaggerDto],
  })
  products: ProductSwaggerDto[];

  @ApiProperty({ description: '전체 제품 수', example: 1 })
  totalCount: number;
}

export class ProductDetailSwaggerDto extends ProductSwaggerDto {
  @ApiProperty({
    description: '카테고리 정보',
    type: SimpleCategorySwaggerDto,
  })
  category: SimpleCategorySwaggerDto;

  @ApiProperty({
    description: '인쇄소 정보',
    type: SimplePrintShopSwaggerDto,
  })
  printShop: SimplePrintShopSwaggerDto;

  @ApiProperty({
    description: '리뷰 목록',
    type: [SimpleProductReviewSwaggerDto],
  })
  reviews: SimpleProductReviewSwaggerDto[];

  @ApiProperty({ description: '북마크 수', example: 0 })
  bookmarkCount: number;
}
