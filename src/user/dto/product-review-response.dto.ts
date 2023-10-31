import { ApiProperty } from '@nestjs/swagger';
import { ProductReview } from 'src/entity/product-review.entity';

export class ProductReviewResponseDto {
  @ApiProperty({
    description: '제품 리뷰',
    type: [ProductReview],
  })
  productReviews: ProductReview[];
}
