import { ApiProperty } from '@nestjs/swagger';
import { SimpleCategorySwaggerDto } from './simple-category.swagger.dto';

export class CategoryListSwaggerDto {
  @ApiProperty({
    description: '카테고리',
    type: [SimpleCategorySwaggerDto],
  })
  categories: SimpleCategorySwaggerDto[];
}
