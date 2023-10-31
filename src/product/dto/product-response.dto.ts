import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/entity/product.entity';

export class ProductsResponseDto {
  @ApiProperty({
    description: '제품 목록',
    type: [Product],
  })
  products: Product[];

  @ApiProperty({
    description: '총 제품 수',
    type: Number,
    example: 1,
  })
  totalCount: number;
}

export class ProductResponseDto {
  @ApiProperty({
    description: '제품',
    type: Product,
  })
  product: Product;
}
