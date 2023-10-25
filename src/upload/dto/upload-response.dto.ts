import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: '업로드된 파일의 URL',
    example: 'https://www.printshop.com',
  })
  url: string;
}
