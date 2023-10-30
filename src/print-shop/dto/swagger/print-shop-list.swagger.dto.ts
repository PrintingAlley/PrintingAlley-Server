import { ApiProperty } from '@nestjs/swagger';

export class PrintShopListSwaggerDto {
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
}

export class PrintShopsResponseSwaggerDto {
  @ApiProperty({ type: [PrintShopListSwaggerDto] })
  printShops: PrintShopListSwaggerDto[];

  @ApiProperty({ example: 100 })
  totalCount: number;
}
