import { ApiProperty } from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';

export class PrintShopsResponseDto {
  @ApiProperty({
    description: '인쇄사 목록',
    type: [PrintShop],
  })
  printShops: PrintShop[];

  @ApiProperty({
    description: '총 인쇄사 수',
    type: Number,
    example: 1,
  })
  totalCount: number;
}

export class PrintShopResponseDto {
  @ApiProperty({
    description: '인쇄사',
    type: PrintShop,
  })
  printShop: PrintShop;
}
