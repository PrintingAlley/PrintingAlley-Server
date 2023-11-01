import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: '업로드된 파일의 URL',
    example: 'https://www.printshop.com',
  })
  url: string;
}

export class UploadMultipleResponseDto {
  @ApiProperty({
    description: '업로드된 파일의 URL 목록',
    type: [String],
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  urls: string[];
}
