import { ApiProperty } from '@nestjs/swagger';

export class SimpleTagSwaggerDto {
  @ApiProperty({ description: '태그 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '태그 이름', example: '소량인쇄' })
  name: string;

  @ApiProperty({ description: '이미지 URL', nullable: true, example: null })
  image: string | null;

  @ApiProperty({ description: '생성일', example: '2023-10-31T01:02:40.328Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T01:02:40.328Z' })
  updatedAt: string;
}
