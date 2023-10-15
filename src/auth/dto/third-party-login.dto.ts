import { ApiProperty } from '@nestjs/swagger';

export class ThirdPartyLoginDto {
  @ApiProperty({
    description: '소셜 로그인 인증 업체 access_token',
    example: 'xxxxx',
  })
  access_token: string;

  @ApiProperty({
    description: '소셜 로그인 인증 업체',
    example: 'google | apple | kakao | naver',
  })
  provider: string;
}

export class ThirdPartyLoginResponseDto {
  @ApiProperty({
    description: 'JWT 토큰',
    example: 'JWT 토큰',
  })
  access_token: string;
}
