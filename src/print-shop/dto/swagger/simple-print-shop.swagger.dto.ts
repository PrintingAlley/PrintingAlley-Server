import { ApiProperty } from '@nestjs/swagger';

export class SimplePrintShopSwaggerDto {
  @ApiProperty({ description: '인쇄사 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '인쇄사 이름', example: '정다운 인쇄사' })
  name: string;

  @ApiProperty({
    description: '주소',
    example: '대구시 중구 동성로 345번길 67, 대구빌딩 6층',
  })
  address: string;

  @ApiProperty({ description: '전화번호', example: '02-732-7000' })
  phone: string;

  @ApiProperty({ description: '이메일', example: 'print@gmail.com' })
  email: string;

  @ApiProperty({
    description: '홈페이지',
    example: 'https://www.publishersglobal.com',
  })
  homepage: string;

  @ApiProperty({ description: '대표자', example: '홍길동' })
  representative: string;

  @ApiProperty({
    description: '소개',
    example: '인쇄사 소개입니다.',
  })
  introduction: string;

  @ApiProperty({
    description: '로고 이미지',
    example: 'https://www.printshop.com/images/ps_logo.png',
  })
  logoImage: string;

  @ApiProperty({
    description: '배경 이미지',
    example: 'https://www.printshop.com/images/ps_background.png',
  })
  backgroundImage: string;

  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude: number;

  @ApiProperty({ description: '경도', example: 126.978 })
  longitude: number;

  @ApiProperty({ description: '생성일', example: '2023-10-31T01:02:40.301Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T01:02:40.301Z' })
  updateAt: string;
}
