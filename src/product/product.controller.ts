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
import {
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { ParseOptionalArrayPipe } from './pipes/parse-optional-array.pipe';
import { ProductService } from './product.service';
import {
  ProductResponseDto,
  ProductsResponseDto,
} from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { ProductReviewService } from 'src/product-review/product-review.service';
import { CreateProductReviewDto } from 'src/product-review/dto/create-product-review.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProductReviewResponseDto } from './dto/product-review-response.dto';
import {
  ProductDetailSwaggerDto,
  ProductListSwaggerDto,
} from './dto/swagger/product-response.swagger.dto';
import { ProductReviewListSwaggerDto } from './dto/swagger/product-review-response.swagger.dto';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productReviewService: ProductReviewService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '제품 목록 조회',
    description: '제품 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '제품 목록 조회 성공',
    type: ProductListSwaggerDto,
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
    description: '검색할 제품 이름입니다.',
  })
  @ApiQuery({
    name: 'tagIds',
    required: false,
    description:
      '태그 ID 목록입니다. 태그 ID 목록을 지정하면, 해당 태그와 연관된 제품 목록을 가져옵니다.',
    type: [Number],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
    @Query('searchText') searchText?: string,
    @Query('tagIds', new ParseOptionalArrayPipe()) tagIds?: number[],
  ): Promise<ProductsResponseDto> {
    return await this.productService.findAll(page, size, searchText, tagIds);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: '제품 조회',
    description: '제품을 조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 조회 성공',
    type: ProductDetailSwaggerDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ProductResponseDto> {
    const product = await this.productService.findOne(id, user.id);
    return { product };
  }

  @Post()
  @ApiOperation({
    summary: '제품 생성',
    description: '제품을 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '제품 생성 성공',
    type: CommonResponseDto,
  })
  async create(
    @Body(new ValidationPipe()) product: CreateProductDto,
  ): Promise<CommonResponseDto> {
    const createdProduct = await this.productService.create(product);
    return createResponse(200, '성공', createdProduct.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '제품 수정',
    description: '제품을 수정하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 수정 성공',
    type: CommonResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) product: CreateProductDto,
  ): Promise<CommonResponseDto> {
    await this.productService.update(id, product);
    return createResponse(200, '성공', id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '제품 삭제',
    description: '제품을 삭제하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 삭제 성공',
    type: CommonResponseDto,
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommonResponseDto> {
    await this.productService.delete(id);
    return createResponse(200, '성공', id);
  }

  @Get(':id/review')
  @ApiOperation({
    summary: '제품 리뷰 조회',
    description: '제품 리뷰를 조회하는 API입니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 리뷰 조회 성공',
    type: ProductReviewListSwaggerDto,
  })
  async getReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductReviewResponseDto> {
    const productReviews =
      await this.productReviewService.findAllByProductId(id);
    return { productReviews };
  }

  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '제품 리뷰 생성',
    description: '제품 리뷰를 생성하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 리뷰 생성 성공',
    type: CommonResponseDto,
  })
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) reviewData: CreateProductReviewDto,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    const createdReview = await this.productReviewService.create(
      id,
      user.id,
      reviewData,
    );
    return createResponse(200, '성공', createdReview.id);
  }

  @Put(':id/review/:reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '제품 리뷰 수정',
    description: '제품 리뷰를 수정하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 리뷰 수정 성공',
    type: CommonResponseDto,
  })
  async updateReview(
    @Param('id', ParseIntPipe) _id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser() user: User,
    @Body(new ValidationPipe()) reviewData: CreateProductReviewDto,
  ): Promise<CommonResponseDto> {
    await this.productReviewService.update(reviewId, user.id, reviewData);
    return createResponse(200, '성공', reviewId);
  }

  @Delete(':id/review/:reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '제품 리뷰 삭제',
    description: '제품 리뷰를 삭제하는 API입니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT 토큰}',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '제품 ID',
  })
  @ApiOkResponse({
    description: '제품 리뷰 삭제 성공',
    type: CommonResponseDto,
  })
  async deleteReview(
    @Param('id', ParseIntPipe) _id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser() user: User,
  ): Promise<CommonResponseDto> {
    await this.productReviewService.delete(reviewId, user.id);
    return createResponse(200, '성공', reviewId);
  }
}
