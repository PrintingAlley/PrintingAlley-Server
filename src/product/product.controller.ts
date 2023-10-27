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
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParseOptionalArrayPipe } from './pipes/parse-optional-array.pipe';
import { Product } from 'src/entity/product.entity';
import { ProductService } from './product.service';
import { ProductsResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import { ProductsResponseSwaggerDto } from './dto/product-list.swagger.dto';
import { ProductDetailSwaggerDto } from './dto/product-detail.swagger.dto';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: '제품 목록 조회',
    description: '제품 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '제품 목록 조회 성공',
    type: ProductsResponseSwaggerDto,
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.findOne(id);
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
}
