import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: '제품 ID',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({
    description: '북마크 그룹 ID, 없으면 기본 그룹으로 지정',
    required: false,
  })
  @IsOptional()
  @IsInt()
  groupId?: number;
}
