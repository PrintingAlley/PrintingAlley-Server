import { ApiProperty } from '@nestjs/swagger';

class CategorySwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '명함' })
  name: string;

  @ApiProperty({ example: 'https://www.printshop.com' })
  image: string;

  @ApiProperty({ example: '2023-10-27T04:00:43.255Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-27T04:00:43.255Z' })
  updatedAt: string;
}

class PrintShopSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '프린트월드' })
  name: string;

  @ApiProperty({ example: '포항시 북구 삼흥로 345번길 01, 포항타워 H동 15층' })
  address: string;

  @ApiProperty({ example: '02-732-7000' })
  phone: string;

  @ApiProperty({ example: 'print@gmail.com' })
  email: string;

  @ApiProperty({ example: 'https://www.publishersglobal.com' })
  homepage: string;

  @ApiProperty({ example: '홍길동' })
  representative: string;

  @ApiProperty({
    example: 'Composed of some 1,000 Korean Printings as members.',
  })
  introduction: string;

  @ApiProperty({ example: 'https://www.printshop.com/image1.jpg' })
  logoImage: string;

  @ApiProperty({ example: 'https://www.printshop.com/image1.jpg' })
  backgroundImage: string;

  @ApiProperty({ example: 37.5665 })
  latitude: number;

  @ApiProperty({ example: 126.978 })
  longitude: number;

  @ApiProperty({ example: '2023-10-27T04:02:00.529Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-27T04:02:00.529Z' })
  updateAt: string;
}

class TagSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '공통' })
  name: string;

  @ApiProperty({ example: null })
  image: string | null;

  @ApiProperty({ example: '2023-10-27T13:18:30.676Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-27T13:18:30.676Z' })
  updatedAt: string;
}

class ReviewSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '리뷰입니다. 명함이 예뻐요' })
  content: string;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ example: '2023-10-27T05:23:53.608Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-27T05:23:53.608Z' })
  updatedAt: string;
}

export class ProductDetailSwaggerDto {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: '특수컬러 명함' })
  name: string;

  @ApiProperty({ example: '100장에 10,000원' })
  priceInfo: string;

  @ApiProperty({ example: '스크래치에 강하고 우수한 탄성을 갖춘 7색상의 제품' })
  introduction: string;

  @ApiProperty({ example: '특수컬러 명함에 대한 자세한 설명' })
  description: string;

  @ApiProperty({ example: 'https://www.printshop.com/image1.jpg' })
  mainImage: string;

  @ApiProperty({
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ example: '2023-10-27T13:17:25.173Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-27T13:19:16.784Z' })
  updateAt: string;

  @ApiProperty({ type: CategorySwaggerDto })
  category: CategorySwaggerDto;

  @ApiProperty({ type: PrintShopSwaggerDto })
  printShop: PrintShopSwaggerDto;

  @ApiProperty({ type: [TagSwaggerDto] })
  tags: TagSwaggerDto[];

  @ApiProperty({ type: [ReviewSwaggerDto] })
  reviews: ReviewSwaggerDto[];

  @ApiProperty({ example: 1 })
  bookmarkCount: number;
}
