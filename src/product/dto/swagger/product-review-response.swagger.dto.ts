import { ApiProperty } from '@nestjs/swagger';
import { SimpleProductReviewSwaggerDto } from 'src/product-review/dto/swagger/simple-product-review.swagger.dto';
import { UserSwaggerDto } from 'src/user/dto/swagger/user-response.swagger.dto';

class ProductReviewSwaggerDto extends SimpleProductReviewSwaggerDto {
  @ApiProperty({ description: '리뷰 작성자 정보', type: UserSwaggerDto })
  user: UserSwaggerDto;
}

export class ProductReviewListSwaggerDto {
  @ApiProperty({
    description: '제품 리뷰 목록',
    type: [ProductReviewSwaggerDto],
  })
  productReviews: ProductReviewSwaggerDto[];
}
