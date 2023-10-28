import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: '유저 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '소셜 로그인 제공업체', example: 'kakao' })
  provider: string;

  @ApiProperty({ description: '유저 타입', example: 'GENERAL' })
  userType: string;

  @ApiProperty({ description: '이름', example: '골목대장' })
  name: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: null,
    required: false,
  })
  profileImage?: string;

  @ApiProperty({ description: '이메일', example: 'abc@gmail.com' })
  email: string;

  @ApiProperty({ description: '생성일', example: '2023-10-19T15:45:07.676Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-20T12:39:00.540Z' })
  updateAt: string;
}
