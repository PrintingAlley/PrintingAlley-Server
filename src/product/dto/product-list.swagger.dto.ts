import { ApiProperty } from '@nestjs/swagger';

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

class ProductListSwaggerDto {
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
  updatedAt: string;

  @ApiProperty({ type: [TagSwaggerDto] })
  tags: TagSwaggerDto[];
}

export class ProductsResponseSwaggerDto {
  @ApiProperty({ type: [ProductListSwaggerDto] })
  products: ProductListSwaggerDto[];

  @ApiProperty({ example: 1 })
  totalCount: number;
}
