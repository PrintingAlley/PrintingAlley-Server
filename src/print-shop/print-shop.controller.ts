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
import { PrintShop } from 'src/entity/print-shop.entity';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { PrintShopsResponseSwaggerDto } from './dto/print-shop-list.swagger.dto';
import { PrintShopsResponseDto } from './dto/print-shop-response.dto';
import { PrintShopDetailSwaggerDto } from './dto/print-shop-detail.swagger.dto';
import { PrintShopReviewService } from 'src/print-shop-review/print-shop-review.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/user.decorator';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { CreatePrintShopReviewDto } from 'src/print-shop-review/dto/create-print-shop-review.dto';
import { User } from 'src/entity/user.entity';

@Controller('print-shop')
@ApiTags('Print Shop')
export class PrintShopController {
  constructor(
    private readonly printShopService: PrintShopService,
    private readonly printShopReviewService: PrintShopReviewService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '인쇄소 목록 조회',
    description: '인쇄소 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 목록 조회 성공',
    type: PrintShopsResponseSwaggerDto,
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PrintShop> {
    return await this.printShopService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '인쇄소 생성',
    description: '인쇄소를 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 생성 성공',
    type: CommonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
  ): Promise<CommonResponseDto> {
    const createdPrintShop = await this.printShopService.create(printShop);
    return createResponse(200, '성공', createdPrintShop.id);
  }

  @Put(':id')
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
  ): Promise<CommonResponseDto> {
    await this.printShopService.update(id, printShop);
    return createResponse(200, '성공', id);
  }

  @Delete(':id')
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
  ): Promise<CommonResponseDto> {
    await this.printShopService.delete(id);
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
    type: [PrintShopReview],
  })
  async getReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PrintShopReview[]> {
    return await this.printShopReviewService.findAllByPrintShopId(id);
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
