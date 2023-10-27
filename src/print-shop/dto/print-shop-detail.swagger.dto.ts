import { ApiProperty } from '@nestjs/swagger';

class ProductSwaggerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '특수컬러 명함' })
  name: string;

  @ApiProperty({ example: null })
  priceInfo: string;

  @ApiProperty({ example: '특수컬러 명함입니다.' })
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

  @ApiProperty({ example: '2023-10-26T19:23:55.150Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-26T19:23:55.150Z' })
  updateAt: string;

  @ApiProperty({
    example: {
      id: 1,
      name: '명함',
      image: null,
      createdAt: '2023-10-26T19:23:50.752Z',
      updatedAt: '2023-10-26T19:23:50.752Z',
    },
  })
  category: any;
}

export class ReviewSwaggerDto {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: '인쇄사 리뷰 내용입니다. 사장님이 친절하세요' })
  content: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ example: '2023-10-26T19:17:45.118Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-26T19:17:45.118Z' })
  updateAt: string;
}

export class PrintShopDetailSwaggerDto {
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

  @ApiProperty({
    example: 'https://www.printshop.com/image1.jpg',
  })
  logoImage: string;

  @ApiProperty({
    example: 'https://www.printshop.com/image1.jpg',
  })
  backgroundImage: string;

  @ApiProperty({ example: 37.5665 })
  latitude: number;

  @ApiProperty({ example: 126.978 })
  longitude: number;

  @ApiProperty({ example: '2023-10-25T12:58:04.560Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-25T12:58:04.560Z' })
  updateAt: string;

  @ApiProperty({ type: [ProductSwaggerDto] })
  products: ProductSwaggerDto[];

  @ApiProperty({ type: [ReviewSwaggerDto] })
  reviews: ReviewSwaggerDto[];
}
