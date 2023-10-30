import { ApiProperty } from '@nestjs/swagger';

class PrintShopDto {
  @ApiProperty({ description: '인쇄사 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '상호명', example: '인쇄프로' })
  name: string;

  @ApiProperty({
    description: '주소',
    example: '창원시 마산회원구 3·15대로 123번길 78, 창원빌딩 F동 13층',
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
  homepage?: string;

  @ApiProperty({ description: '대표자명', example: '홍길동' })
  representative: string;

  @ApiProperty({
    description: '인쇄사 소개',
    example: 'Composed of some 1,000 Korean Printings as members.',
  })
  introduction: string;

  @ApiProperty({
    description: '인쇄사 로고 이미지',
    example:
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999453375F9A167019',
  })
  logoImage?: string;

  @ApiProperty({
    description: '인쇄사 배경 이미지',
    example:
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999453375F9A167019',
  })
  backgroundImage?: string;

  @ApiProperty({ description: '위도', example: 37.5665 })
  latitude: string;

  @ApiProperty({ description: '경도', example: 126.978 })
  longitude: string;

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:43:08.324Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:43:08.324Z' })
  updateAt: string;
}

export class UserPrintShopReviewListSwaggerDto {
  @ApiProperty({
    description: '인쇄사 리뷰 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '리뷰 내용',
    example: '사장님이 친절하세요',
  })
  content: string;

  @ApiProperty({
    description: '별점',
    example: 4,
  })
  rating: number;

  @ApiProperty({
    description: '이미지 URL 배열',
    example: [
      'https://www.printshop.com/image1.jpg',
      'https://www.printshop.com/image2.jpg',
      'https://www.printshop.com/image3.jpg',
    ],
  })
  images: string[];

  @ApiProperty({
    description: '생성일',
    example: '2023-10-30T00:48:47.317Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '수정일',
    example: '2023-10-30T00:50:30.730Z',
  })
  updateAt: string;

  @ApiProperty({
    description: '인쇄소 정보',
    type: () => PrintShopDto,
  })
  printShop: PrintShopDto;
}
