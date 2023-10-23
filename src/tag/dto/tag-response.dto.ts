import { ApiProperty } from '@nestjs/swagger';

class ChildDTO {
  @ApiProperty({
    description: '하위 태그의 아이디.',
    example: 6,
  })
  id: number;

  @ApiProperty({
    description: '하위 태그의 이름.',
    example: '소량인쇄',
  })
  name: string;

  @ApiProperty({
    description: '하위 태그의 이미지',
    example: null,
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: '하위 태그의 부모 아이디',
    example: 1,
    nullable: true,
  })
  parent_id: number | null;

  @ApiProperty({
    description: '하위 태그의 자식들.',
    type: () => [ChildDTO],
  })
  children: ChildDTO[];
}

export class TagResponseDTO {
  @ApiProperty({
    description: '태그의 아이디.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '태그의 이름.',
    example: '공통',
  })
  name: string;

  @ApiProperty({
    description: '태그의 이미지',
    example: null,
    nullable: true,
  })
  image: string | null;

  @ApiProperty({
    description: '태그의 부모 아이디',
    example: null,
    nullable: true,
  })
  parent_id: number | null;

  @ApiProperty({
    description: '태그의 자식들.',
    type: () => [ChildDTO],
  })
  children: ChildDTO[];
}

export class TagsResponseDTO {
  @ApiProperty({
    description: '태그 계층 구조.',
    type: () => [TagResponseDTO],
  })
  hierarchies: TagResponseDTO[];
}
