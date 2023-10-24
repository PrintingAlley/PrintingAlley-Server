import { ApiProperty } from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';

export class PrintShopsResponseDto {
  @ApiProperty({
    description: '인쇄소 목록',
    type: [PrintShop],
  })
  printShops: PrintShop[];

  @ApiProperty({
    description: '총 인쇄소 수',
    type: Number,
    example: 1,
  })
  totalCount: number;
}

class TagDtoForSwagger {
  @ApiProperty({ example: 6 })
  id: number;

  @ApiProperty({ example: '소량인쇄' })
  name: string;

  @ApiProperty({ nullable: true, example: null })
  image: string | null;

  @ApiProperty({ example: '2023-10-23T02:23:10.769Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-23T02:23:10.769Z' })
  updatedAt: string;
}

export class PrintShopResponseDtoForSwagger {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '프린트킹' })
  name: string;

  @ApiProperty({ example: '대구시 중구 동성로 345번길 67, 대구빌딩 6층' })
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
    example: 'https://www.publishersglobal.com',
  })
  logoImage: string;

  @ApiProperty({
    example: 'https://www.publishersglobal.com',
  })
  backgroundImage: string;

  @ApiProperty({ example: 37.5665 })
  latitude: number;

  @ApiProperty({ example: 126.978 })
  longitude: number;

  @ApiProperty({ example: '2023-10-23T02:23:10.525Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-10-23T02:48:16.071Z' })
  updateAt: string;

  @ApiProperty({ type: [TagDtoForSwagger] })
  tags: TagDtoForSwagger[];
}

export class PrintShopsResponseDtoForSwagger {
  @ApiProperty({ type: [PrintShopResponseDtoForSwagger] })
  printShops: PrintShopResponseDtoForSwagger[];

  @ApiProperty({ example: 100 })
  totalCount: number;
}
