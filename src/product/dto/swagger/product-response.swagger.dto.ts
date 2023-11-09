import { ApiProperty } from '@nestjs/swagger';
import { SimpleCategorySwaggerDto } from 'src/category/dto/swagger/simple-category.swagger.dto';
import { SimplePrintShopSwaggerDto } from 'src/print-shop/dto/swagger/simple-print-shop.swagger.dto';
import { SimpleTagSwaggerDto } from 'src/tag/dto/swagger/simple-tag.swagger.dto';
import { SimpleProductSwaggerDto } from './simple-product.swagger.dto';
import { SimpleProductReviewSwaggerDto } from 'src/product-review/dto/swagger/simple-product-review.swagger.dto';

export class ProductWithTagSwaggerDto extends SimpleProductSwaggerDto {
  @ApiProperty({
    description: '태그 목록',
    type: [SimpleTagSwaggerDto],
  })
  tags: SimpleTagSwaggerDto[];
}

export class ProductListSwaggerDto {
  @ApiProperty({
    description: '제품 목록',
    type: [ProductWithTagSwaggerDto],
  })
  products: ProductWithTagSwaggerDto[];

  @ApiProperty({ description: '전체 제품 수', example: 1 })
  totalCount: number;
}

export class ProductSwaggerDto extends ProductWithTagSwaggerDto {
  @ApiProperty({ description: '사장님 ID', example: 1 })
  ownerId: number;

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

  @ApiProperty({ description: '북마크 여부', example: false })
  isBookmarked: boolean;

  @ApiProperty({ description: '북마크 수', example: 0 })
  bookmarkCount: number;
}

export class ProductDetailSwaggerDto {
  @ApiProperty({
    description: '제품',
    type: ProductSwaggerDto,
  })
  product: ProductSwaggerDto;

  @ApiProperty({
    description: '북마크 ID',
    type: Number,
    example: 1,
  })
  bookmarkId: number | null;
}
