import { ApiProperty } from '@nestjs/swagger';
import { SimpleProductReviewSwaggerDto } from 'src/product-review/dto/swagger/simple-product-review.swagger.dto';
import { SimpleProductSwaggerDto } from 'src/product/dto/swagger/simple-product.swagger.dto';

class UserProductReviewSwaggerDto extends SimpleProductReviewSwaggerDto {
  @ApiProperty({ description: '제품 정보', type: SimpleProductSwaggerDto })
  product: SimpleProductSwaggerDto;
}

export class UserProductReviewListSwaggerDto {
  @ApiProperty({
    description: '리뷰 목록',
    type: [UserProductReviewSwaggerDto],
  })
  productReviews: UserProductReviewSwaggerDto[];
}
