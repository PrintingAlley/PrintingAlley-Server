import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/entity/tag.entity';

export class TagsResponseDto {
  @ApiProperty({
    description: '태그 계층 구조',
    type: [Tag],
  })
  hierarchies: Tag[];
}

export class TagResponseDto {
  @ApiProperty({
    description: '태그',
    type: Tag,
  })
  tag: Tag;
}
