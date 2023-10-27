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
