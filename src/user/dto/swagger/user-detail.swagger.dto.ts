import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/entity/user.entity';

export class UserDetailSwaggerDto {
  @ApiProperty({
    description: '소셜 로그인 제공업체',
    example: 'naver',
  })
  provider: string;

  @ApiProperty({
    description: '유저 타입',
    enum: UserType,
    example: UserType.GENERAL,
  })
  userType: UserType;

  @ApiProperty({
    description: '이름',
    example: '나는야 골목대장',
  })
  name: string;

  @ApiProperty({
    description: '프로필 사진',
    example: 'https://www.printshop.com',
  })
  profileImage?: string;

  @ApiProperty({
    description: '이메일',
    example: 'joydonald1@naver.com',
  })
  email?: string;

  @ApiProperty({
    description: '생성일',
    example: '2023-10-30T00:48:22.369Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '수정일',
    example: '2023-10-30T01:10:36.306Z',
  })
  updateAt: string;
}
