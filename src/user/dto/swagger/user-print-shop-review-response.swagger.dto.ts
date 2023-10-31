import { ApiProperty } from '@nestjs/swagger';
import { SimplePrintShopReviewSwaggerDto } from 'src/print-shop-review/dto/swagger/simple-print-shop-review.swagger.dto';
import { SimplePrintShopSwaggerDto } from 'src/print-shop/dto/swagger/simple-print-shop.swagger.dto';

class UserPrintShopReviewSwaggerDto extends SimplePrintShopReviewSwaggerDto {
  @ApiProperty({ description: '인쇄사 정보', type: SimplePrintShopSwaggerDto })
  printShop: SimplePrintShopSwaggerDto;
}

export class UserPrintShopReviewListSwaggerDto {
  @ApiProperty({
    description: '리뷰 목록',
    type: [UserPrintShopReviewSwaggerDto],
  })
  printShopReviews: UserPrintShopReviewSwaggerDto[];
}
