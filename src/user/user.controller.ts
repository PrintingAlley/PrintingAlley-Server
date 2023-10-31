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
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PrintShopReviewResponseDto } from './dto/print-shop-review-response.dto';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';

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
    type: UserResponseDto,
  })
  async getMyInfo(@GetUser() currentUser: User): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(currentUser.id);
    return { user };
  }

  // 작성한 인쇄소 리뷰 조회
  @Get('print-shop-review')
  @ApiOperation({
    summary: '내가 작성한 인쇄소 리뷰 조회',
    description: '로그인한 사용자가 작성한 인쇄소 리뷰를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내가 작성한 인쇄소 리뷰 조회 성공',
    type: PrintShopReviewResponseDto,
  })
  async getMyPrintShopReviews(
    @GetUser() user: User,
  ): Promise<PrintShopReviewResponseDto> {
    const printShopReviews = await this.userService.getPrintShopReviewsByUserId(
      user.id,
    );
    return { printShopReviews };
  }

  // 작성한 제품 리뷰 조회
  @Get('product-review')
  @ApiOperation({
    summary: '내가 작성한 제품 리뷰 조회',
    description: '로그인한 사용자가 작성한 제품 리뷰를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내가 작성한 제품 리뷰 조회 성공',
    type: ProductReviewResponseDto,
  })
  async getMyProductReviews(
    @GetUser() user: User,
  ): Promise<ProductReviewResponseDto> {
    const productReviews = await this.userService.getProductReviewsByUserId(
      user.id,
    );
    return { productReviews };
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
