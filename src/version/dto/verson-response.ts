import { ApiProperty } from '@nestjs/swagger';

export class VersionResponseDto {
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
    description: '버전 체크 결과',
    example: 0,
  })
  code: number;
}
