import { ApiProperty } from '@nestjs/swagger';

export class SimpleCategorySwaggerDto {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '카테고리 이름', example: '명함' })
  name: string;

  @ApiProperty({ description: '이미지 URL', nullable: true, example: null })
  image: string | null;

  @ApiProperty({ description: '생성일', example: '2023-10-30T16:17:07.050Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T16:17:07.050Z' })
  updatedAt: string;
}
