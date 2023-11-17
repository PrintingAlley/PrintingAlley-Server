import { ApiProperty } from '@nestjs/swagger';
import { SimplePrintShopSwaggerDto } from './simple-print-shop.swagger.dto';
import { SimpleProductSwaggerDto } from 'src/product/dto/swagger/simple-product.swagger.dto';
import { SimplePrintShopReviewSwaggerDto } from 'src/print-shop-review/dto/swagger/simple-print-shop-review.swagger.dto';
import { SimpleTagSwaggerDto } from 'src/tag/dto/swagger/simple-tag.swagger.dto';

export class PrintShopWithTagSwaggerDto extends SimplePrintShopSwaggerDto {
  @ApiProperty({
    description: '태그 목록',
    type: [SimpleTagSwaggerDto],
  })
  tags: SimpleTagSwaggerDto[];
}

export class PrintShopListSwaggerDto {
  @ApiProperty({
    description: '인쇄사 목록',
    type: [PrintShopWithTagSwaggerDto],
  })
  printShops: PrintShopWithTagSwaggerDto[];

  @ApiProperty({ description: '총 인쇄사 수', example: 1 })
  totalCount: number;
}

class PrintShopSwaggerDto extends SimplePrintShopSwaggerDto {
  @ApiProperty({ description: '인쇄 방식', example: '디지털 인쇄' })
  printType: string;

  @ApiProperty({ description: '후가공', example: '도무송' })
  afterProcess: string;

  @ApiProperty({ description: '사장님 ID', example: 1 })
  ownerId: number;

  @ApiProperty({
    description: '태그 목록',
    type: [SimpleTagSwaggerDto],
  })
  tags: SimpleTagSwaggerDto[];

  @ApiProperty({
    description: '제품 목록',
    type: [SimpleProductSwaggerDto],
  })
  products: SimpleProductSwaggerDto[];

  @ApiProperty({
    description: '리뷰 목록',
    type: [SimplePrintShopReviewSwaggerDto],
  })
  reviews: SimplePrintShopReviewSwaggerDto[];
}

export class PrintShopDetailSwaggerDto {
  @ApiProperty({
    description: '인쇄사 상세 정보',
    type: PrintShopSwaggerDto,
  })
  printShop: PrintShopSwaggerDto;
}
