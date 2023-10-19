import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginResponseDto {
  @ApiProperty({
    description: '응답 상태 코드',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: '응답 메시지',
    example: '성공',
  })
  message: string;

  @ApiProperty({
    description: 'JWT 토큰',
    example: 'JWT 토큰',
  })
  access_token: string;
}
