import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenResponseDto {
  @ApiProperty({
    description: '유효한 토큰인지 여부',
    example: true,
  })
  isValid: boolean;
}
