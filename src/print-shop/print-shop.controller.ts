import { UserService } from 'src/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PrintShopService } from './print-shop.service';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import {
  PrintShopResponseDto,
  PrintShopsResponseDto,
} from './dto/print-shop-response.dto';
import { PrintShopReviewService } from 'src/print-shop-review/print-shop-review.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/user.decorator';
import { CreatePrintShopReviewDto } from 'src/print-shop-review/dto/create-print-shop-review.dto';
import { User, UserType } from 'src/entity/user.entity';
import { PrintShopReviewResponseDto } from './dto/print-shop-review-response.dto';
import {
  PrintShopDetailSwaggerDto,
  PrintShopListSwaggerDto,
} from './dto/swagger/print-shop-response.swagger.dto';
import { PrintShopReviewListSwaggerDto } from './dto/swagger/print-shop-review-response.swagger.dto';

@Controller('print-shop')
@ApiTags('Print Shop')
export class PrintShopController {
  constructor(
    private readonly printShopService: PrintShopService,
    private readonly printShopReviewService: PrintShopReviewService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '인쇄소 목록 조회',
    description: '인쇄소 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 목록 조회 성공',
    type: PrintShopListSwaggerDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호입니다. 1부터 시작하며, 기본값은 1입니다.',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: '페이지 크기입니다. 기본값은 20입니다.',
  })
  @ApiQuery({
    name: 'searchText',
    required: false,
    description: '검색할 인쇄소 이름입니다.',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
    @Query('searchText') searchText?: string,
  ): Promise<PrintShopsResponseDto> {
    return await this.printShopService.findAll(page, size, searchText);
  }

  @Get(':id')
  @ApiOperation({
    summary: '인쇄소 조회',
    description: '인쇄소를 조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 조회 성공',
    type: PrintShopDetailSwaggerDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrintShopResponseDto> {
    const printShop = await this.printShopService.findOne(id);
    return { printShop };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄소 생성',
    description: '인쇄소를 생성하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '인쇄소 생성 성공',
    type: CommonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const createdPrintShop = await this.printShopService.create(
      printShop,
      user.id,
    );

    if (user.userType !== UserType.PRINTSHOP_OWNER) {
      user.userType = UserType.PRINTSHOP_OWNER;
      await this.userService.updateUserType(user.id, UserType.PRINTSHOP_OWNER);
    }

    return createResponse(200, '성공', createdPrintShop.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄소 수정',
    description: '인쇄소를 수정하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 수정 성공',
    type: CommonResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.printShopService.update(id, printShop, user.id);
    return createResponse(200, '성공', id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄소 삭제',
    description: '인쇄소를 삭제하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄소 ID',
  })
  @ApiOkResponse({
    description: '인쇄소 삭제 성공',
    type: CommonResponseDto,
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.printShopService.delete(id, user.id);
    return createResponse(200, '성공', id);
  }

  @Get(':id/review')
  @ApiOperation({
    summary: '인쇄사 리뷰 조회',
    description: '인쇄사 리뷰를 조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 리뷰 조회 성공',
    type: PrintShopReviewListSwaggerDto,
  })
  async getReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrintShopReviewResponseDto> {
    const printShopReviews =
      await this.printShopReviewService.findAllByPrintShopId(id);
    return { printShopReviews };
  }

  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄사 리뷰 생성',
    description: '인쇄사 리뷰를 생성하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 리뷰 생성 성공',
    type: CommonResponseDto,
  })
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) reviewData: CreatePrintShopReviewDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const createdReview = await this.printShopReviewService.create(
      id,
      user.id,
      reviewData,
    );
    return createResponse(200, '성공', createdReview.id);
  }

  @Put(':id/review/:reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄사 리뷰 수정',
    description: '인쇄사 리뷰를 수정하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 리뷰 수정 성공',
    type: CommonResponseDto,
  })
  async updateReview(
    @Param('id', ParseIntPipe) _id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser() user: User,
    @Body(new ValidationPipe()) reviewData: CreatePrintShopReviewDto,
  ): Promise<CommonResponseDto> {
    await this.printShopReviewService.update(reviewId, user.id, reviewData);
    return createResponse(200, '성공', reviewId);
  }

  @Delete(':id/review/:reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄사 리뷰 삭제',
    description: '인쇄사 리뷰를 삭제하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 리뷰 삭제 성공',
    type: CommonResponseDto,
  })
  async deleteReview(
    @Param('id', ParseIntPipe) _id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.printShopReviewService.delete(reviewId, user.id);
    return createResponse(200, '성공', reviewId);
  }
}
