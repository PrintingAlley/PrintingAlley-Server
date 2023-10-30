import { ApiProperty } from '@nestjs/swagger';

class UserDtoForPrintShopReview {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '소셜 로그인 제공업체', example: 'naver' })
  provider: string;

  @ApiProperty({ description: '유저 타입', example: 'GENERAL' })
  userType: string;

  @ApiProperty({ description: '이름', example: '나는야 골목대장' })
  name: string;

  @ApiProperty({
    description: '프로필 사진',
    example: 'https://www.printshop.com',
  })
  profileImage: string;

  @ApiProperty({ description: '이메일', example: 'joydonald1@naver.com' })
  email: string;

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:48:22.369Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T01:10:36.306Z' })
  updateAt: string;
}

export class PrintShopReviewListSwaggerDto {
  @ApiProperty({ description: '리뷰 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '리뷰 내용', example: '사장님이 친절하세요' })
  content: string;

  @ApiProperty({ description: '별점', example: 4 })
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

  @ApiProperty({ description: '생성일', example: '2023-10-30T00:48:47.317Z' })
  createdAt: string;

  @ApiProperty({ description: '수정일', example: '2023-10-30T00:50:30.730Z' })
  updateAt: string;

  @ApiProperty({
    description: '사용자 정보',
    type: () => UserDtoForPrintShopReview,
  })
  user: UserDtoForPrintShopReview;
}
