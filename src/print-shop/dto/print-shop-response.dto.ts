import { ApiProperty } from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';

export class PrintShopResponseDto {
  @ApiProperty({ type: [PrintShop] })
  printShops: PrintShop[];

  @ApiProperty()
  totalCount: number;
}
