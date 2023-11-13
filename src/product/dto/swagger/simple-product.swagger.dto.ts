import { ApiProperty } from '@nestjs/swagger';

export class SimpleProductSwaggerDto {
  @ApiProperty({ description: '제품 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '제품 이름', example: '특수컬러 명함' })
  name: string;

  @ApiProperty({ description: '제품 크기', example: '90*50mm' })
  size: string;

  @ApiProperty({ description: '종이 종류', example: '종이이름+평량(g)' })
  paper: string;

  @ApiProperty({ description: '인쇄 방식', example: '디지털 인쇄' })
  printType: string;

  @ApiProperty({ description: '후가공', example: '도무송' })
  afterProcess: string;

  @ApiProperty({
    description: '디자이너 또는 디자인 스튜디오 이름',
    example: '프린팅 스튜디오',
  })
  designer: string;

  @ApiProperty({
    description: '제품 소개',
    example: '스크래치에 강하고 우수한 탄성을 갖춘 7색상의 제품',
  })
  introduction: string;

  @ApiProperty({
    description: '제품 설명',
    example: '특수컬러 명함에 대한 자세한 설명',
  })
  description: string;

  @ApiProperty({
    description: '메인 이미지 URL',
    example: 'https://www.printshop.com/image1.jpg',
  })
  mainImage: string;

  @ApiProperty({
    description: '이미지 URL 목록',
    type: [String],
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({ description: '생성일', example: '2023-10-31T01:17:08.955Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-31T01:17:08.955Z' })
  updateAt: string;
}
