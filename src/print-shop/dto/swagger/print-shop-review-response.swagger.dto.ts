import { ApiProperty } from '@nestjs/swagger';
import { SimplePrintShopSwaggerDto } from 'src/print-shop/dto/swagger/simple-print-shop.swagger.dto';
import { UserSwaggerDto } from 'src/user/dto/swagger/user-response.swagger.dto';

class PrintShopReviewSwaggerDto extends SimplePrintShopSwaggerDto {
  @ApiProperty({ description: '리뷰 작성자 정보', type: UserSwaggerDto })
  user: UserSwaggerDto;
}

export class PrintShopReviewListSwaggerDto {
  @ApiProperty({
    description: '인쇄사 리뷰 목록',
    type: [PrintShopReviewSwaggerDto],
  })
  printShopReviews: PrintShopReviewSwaggerDto[];
}
