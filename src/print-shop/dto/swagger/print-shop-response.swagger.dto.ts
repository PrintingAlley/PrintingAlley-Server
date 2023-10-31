import { ApiProperty } from '@nestjs/swagger';
import { SimplePrintShopSwaggerDto } from './simple-print-shop.swagger.dto';
import { SimpleProductSwaggerDto } from 'src/product/dto/swagger/simple-product.swagger.dto';
import { SimplePrintShopReviewSwaggerDto } from 'src/print-shop-review/dto/swagger/simple-print-shop-review.swagger.dto';

export class PrintShopListSwaggerDto {
  @ApiProperty({
    description: '인쇄사 목록',
    type: [SimplePrintShopSwaggerDto],
  })
  printShops: SimplePrintShopSwaggerDto[];

  @ApiProperty({ description: '총 인쇄사 수', example: 1 })
  totalCount: number;
}

class PrintShopSwaggerDto extends SimplePrintShopSwaggerDto {
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
