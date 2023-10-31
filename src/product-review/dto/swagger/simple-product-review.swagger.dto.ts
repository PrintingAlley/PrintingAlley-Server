import { ApiProperty } from '@nestjs/swagger';

export class SimpleProductReviewSwaggerDto {
  @ApiProperty({ description: '리뷰 ID', example: 1 })
  id: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '퀄리티가 좋습니다. 추천합니다.',
  })
  content: string;

  @ApiProperty({ description: '평점', example: 4 })
  rating: number;

  @ApiProperty({
    description: '이미지 URL 목록',
    type: [String],
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: '생성일', example: '2023-10-31T01:27:48.089Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T01:27:48.089Z' })
  updateAt: string;
}
