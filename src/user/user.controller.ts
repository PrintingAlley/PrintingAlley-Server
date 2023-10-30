import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorators/user.decorator';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { ProductReview } from 'src/entity/product-review.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UserDetailSwaggerDto } from './dto/swagger/user-detail.swagger.dto';
import { UserPrintShopReviewListSwaggerDto } from './dto/swagger/user-print-shop-review-list.swagger.dto';
import { UserProductReviewListSwaggerDto } from './dto/swagger/user-product-review-list.swagger.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
@ApiTags('User')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 내 정보 조회
  @Get()
  @ApiOperation({
    summary: '내 정보 조회',
    description: '로그인한 사용자의 정보를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내 정보 조회 성공',
    type: UserDetailSwaggerDto,
  })
  async getMyInfo(@GetUser() user: User): Promise<User> {
    return this.userService.getUserById(user.id);
  }

  // 작성한 인쇄소 리뷰 조회
  @Get('print-shop-review')
  @ApiOperation({
    summary: '내가 작성한 인쇄소 리뷰 조회',
    description: '로그인한 사용자가 작성한 인쇄소 리뷰를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내가 작성한 인쇄소 리뷰 조회 성공',
    type: [UserPrintShopReviewListSwaggerDto],
  })
  async getMyPrintShopReviews(
    @GetUser() user: User,
  ): Promise<PrintShopReview[]> {
    return this.userService.getPrintShopReviewsByUserId(user.id);
  }

  // 작성한 제품 리뷰 조회
  @Get('product-review')
  @ApiOperation({
    summary: '내가 작성한 제품 리뷰 조회',
    description: '로그인한 사용자가 작성한 제품 리뷰를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내가 작성한 제품 리뷰 조회 성공',
    type: [UserProductReviewListSwaggerDto],
  })
  async getMyProductReviews(@GetUser() user: User): Promise<ProductReview[]> {
    return this.userService.getProductReviewsByUserId(user.id);
  }

  // 프로필 수정
  @Put()
  @ApiOperation({
    summary: '프로필 수정',
    description: '로그인한 사용자의 프로필을 수정하는 API입니다.',
  })
  @ApiOkResponse({
    description: '프로필 수정 성공',
    type: CommonResponseDto,
  })
  async updateProfile(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.userService.updateProfile(user.id, updateUserDto);
    return createResponse(200, '성공', null);
  }

  // 이름 수정
  @Put('name')
  @ApiOperation({
    summary: '이름 수정',
    description: '로그인한 사용자의 이름을 수정하는 API입니다.',
  })
  @ApiOkResponse({
    description: '이름 수정 성공',
    type: CommonResponseDto,
  })
  async updateName(
    @Body(new ValidationPipe()) updateNameDto: UpdateUserNameDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.userService.updateName(user.id, updateNameDto.name);
    return createResponse(200, '성공', null);
  }
}
