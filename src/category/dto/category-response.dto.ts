import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/entity/category.entity';

export class CategoriesResponseDto {
  @ApiProperty({
    description: '카테고리 목록',
    type: [Category],
  })
  categories: Category[];
}
