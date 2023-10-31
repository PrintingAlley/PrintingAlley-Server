import { ApiProperty } from '@nestjs/swagger';

export class UserSwaggerDto {
  @ApiProperty({
    description: '유저 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '소셜 로그인 제공업체',
    example: 'naver',
  })
  provider: string;

  @ApiProperty({
    description: '유저 타입',
    example: 'GENERAL',
  })
  userType: string;

  @ApiProperty({
    description: '이름',
    example: '1번째 골목대장',
  })
  name: string;

  @ApiProperty({
    description: '프로필 사진',
    example: null,
  })
  profileImage: string | null;

  @ApiProperty({
    description: '이메일',
    example: 'abc@gmail.com',
  })
  email: string | null;

  @ApiProperty({
    description: '생성일',
    example: '2023-10-31T01:03:32.467Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '수정일',
    example: '2023-10-31T01:03:32.467Z',
  })
  updateAt: string;
}

export class UserDetailSwaggerDto {
  @ApiProperty({
    description: '유저 정보',
    type: UserSwaggerDto,
  })
  user: UserSwaggerDto;
}
