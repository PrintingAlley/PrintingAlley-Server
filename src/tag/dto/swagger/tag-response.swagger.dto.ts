import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TagSwaggerDto {
  @ApiProperty({ description: '태그 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '태그 이름', example: '공통' })
  name: string;

  @ApiPropertyOptional({ description: '태그 이미지 URL', example: null })
  image: string | null;

  @ApiPropertyOptional({ description: '부모 태그 ID', example: null })
  parentId: number | null;

  @ApiProperty({
    description: '자식 태그 목록',
    type: () => [TagSwaggerDto],
  })
  children: TagSwaggerDto[];
}

export class TagDetailSwaggerDto {
  @ApiProperty({ description: '태그 상세 정보', type: () => TagSwaggerDto })
  tag: TagSwaggerDto;
}

export class TagListSwaggerDto {
  @ApiProperty({
    description: '태그 계층 목록',
    type: () => [TagSwaggerDto],
  })
  hierarchies: TagSwaggerDto[];
}
