import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto {
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
    description: '응답 데이터 ID',
    example: 1,
  })
  dataId?: number | number[];
}
