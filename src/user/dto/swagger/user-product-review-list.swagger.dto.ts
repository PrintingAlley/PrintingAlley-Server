import { ApiProperty } from '@nestjs/swagger';

class ProductDtoForUser {
  @ApiProperty({ description: '제품 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '제품명', example: '특수컬러 명함' })
  name: string;

  @ApiProperty({
    description: '제품 가격 정보',
    example: '100장에 10,000원',
    nullable: true,
  })
  priceInfo?: string;

  @ApiProperty({
    description: '제품 소개',
    example: '스크래치에 강하고 우수한 탄성을 갖춘 7색상의 제품',
  })
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    example: '특수컬러 명함에 대한 자세한 설명',
  })
  description: string;

  @ApiProperty({
    description: '제품 메인 이미지',
    example: 'https://www.printshop.com/image1.jpg',
  })
  mainImage: string;

  @ApiProperty({
    description: '제품 이미지들',
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:46:02.025Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:46:02.025Z' })
  updateAt: string;
}

export class UserProductReviewListSwaggerDto {
  @ApiProperty({ description: '제품 리뷰 ID', example: 1 })
  id: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '나무랄데가 없는 좋은 제품입니다.',
  })
  content: string;

  @ApiProperty({ description: '별점', example: 5 })
  rating: number;

  @ApiProperty({
    description: '이미지 URL 배열',
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:49:31.037Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:49:31.037Z' })
  updateAt: string;

  @ApiProperty({ description: '제품 정보', type: () => ProductDtoForUser })
  product: ProductDtoForUser;
}
