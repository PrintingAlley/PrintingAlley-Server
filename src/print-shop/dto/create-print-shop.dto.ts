import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePrintShopDto {
  @ApiProperty({
    description: '상호명',
    required: true,
    example: '모든인쇄',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: '주소',
    required: true,
    example: '서울시 강남구',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  address: string;

  @ApiProperty({
    description: '전화번호',
    required: true,
    example: '02-123-4567',
  })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'abc@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '홈페이지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @IsNotEmpty()
  @IsUrl()
  homepage: string;

  @ApiProperty({
    description: '대표자명',
    required: true,
    example: '홍길동',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  representative: string;

  @ApiProperty({
    description: '프린트샵 소개',
    required: true,
    example: '프린트샵 소개',
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  introduction: string;

  @ApiProperty({
    description: '프린트샵 로고 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @IsNotEmpty()
  @IsUrl()
  logoImage: string;

  @ApiProperty({
    description: '프린트샵 배경 이미지',
    required: true,
    example: 'https://www.printshop.com',
  })
  @IsNotEmpty()
  @IsUrl()
  backgroundImage: string;

  @ApiProperty({
    description: '위도',
    required: true,
    example: 37.123456,
  })
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({
    description: '경도',
    required: true,
    example: 127.123456,
  })
  @IsNotEmpty()
  longitude: string;
}
