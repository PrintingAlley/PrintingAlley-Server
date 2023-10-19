import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({
    description: '소셜 로그인 인증 업체 access_token',
    required: true,
    example: 'xxxxx',
  })
  @IsNotEmpty()
  access_token: string;

  @ApiProperty({
    description: '소셜 로그인 인증 업체',
    required: true,
    example: 'google | apple | kakao | naver',
  })
  @IsNotEmpty()
  provider: string;
}
