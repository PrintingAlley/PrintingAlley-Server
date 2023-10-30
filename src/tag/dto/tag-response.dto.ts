import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/entity/tag.entity';
import { TagSwaggerDto } from './swagger/tag.swagger.dto';

export class TagsResponseDto {
  @ApiProperty({
    description: '태그 계층 구조',
    type: () => [TagSwaggerDto],
  })
  hierarchies: Tag[];
}
