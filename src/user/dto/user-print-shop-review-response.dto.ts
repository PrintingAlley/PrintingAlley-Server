import { ApiProperty } from '@nestjs/swagger';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';

export class UserPrintShopReviewResponseDto {
  @ApiProperty({
    description: '인쇄사 리뷰',
    type: [PrintShopReview],
  })
  printShopReviews: PrintShopReview[];
}
