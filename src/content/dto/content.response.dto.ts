import { ApiProperty } from '@nestjs/swagger';
import { Content } from 'src/entity/content.entity';

export class ContentsResponseDto {
  @ApiProperty({
    description: '콘텐츠 목록',
    type: [Content],
  })
  contents: Content[];
}

export class ContentResponseDto {
  @ApiProperty({
    description: '콘텐츠',
    type: Content,
  })
  content: Content;
}
