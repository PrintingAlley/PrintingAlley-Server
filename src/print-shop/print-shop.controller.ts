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
  Req,
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
import { Request } from 'express';
import { ParseOptionalArrayPipe } from 'src/product/pipes/parse-optional-array.pipe';

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
    summary: '인쇄사 목록 조회',
    description: '인쇄사 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '인쇄사 목록 조회 성공',
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
    description: '검색할 인쇄사 이름입니다.',
  })
  @ApiQuery({
    name: 'tagIds',
    required: false,
    description:
      '태그 ID 목록입니다. 태그 ID 목록을 지정하면, 해당 태그와 연관된 제품 목록을 가져옵니다.',
    type: [Number],
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: '정렬 기준입니다. 기본값은 "id"입니다.',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: '정렬 순서입니다. 기본값은 "ASC"입니다.',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
    @Query('searchText') searchText?: string,
    @Query('tagIds', new ParseOptionalArrayPipe()) tagIds?: number[],
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PrintShopsResponseDto> {
    return await this.printShopService.findAll(
      page,
      size,
      searchText,
      tagIds,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: '인쇄사 조회',
    description: '인쇄사  조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 조회 성공',
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
    summary: '인쇄사 생성',
    description: '인쇄사  생성하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiOkResponse({
    description: '인쇄사 생성 성공',
    type: CommonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const createdPrintShop = await this.printShopService.create(
      printShop,
      user,
    );

    if (user.userType === UserType.GENERAL) {
      user.userType = UserType.PRINTSHOP_OWNER;
      await this.userService.updateUserType(user.id, UserType.PRINTSHOP_OWNER);
    }

    return createResponse(200, '성공', createdPrintShop.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '인쇄사 수정',
    description: '인쇄사  수정하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 수정 성공',
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
    summary: '인쇄사 삭제',
    description: '인쇄사  삭제하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 삭제 성공',
    type: CommonResponseDto,
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.printShopService.delete(id, user.id);
    return createResponse(200, '성공', id);
  }

  @Post(':id/view')
  @ApiOperation({
    summary: '인쇄사 조회수 증가',
    description: '인쇄사 조회수를 증가하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인쇄사 ID',
  })
  @ApiOkResponse({
    description: '인쇄사 조회수 증가 성공',
    type: CommonResponseDto,
  })
  async increaseViewCount(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<CommonResponseDto> {
    const clientIp = req.ip;

    await this.printShopService.increaseViewCount(id, clientIp);
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
