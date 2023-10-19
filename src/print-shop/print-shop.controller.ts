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
import { PrintShopService } from './print-shop.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';
import { ParseOptionalArrayPipe } from './pipes/parse-optional-array.pipe';
import { PrintShopResponseDto } from './dto/print-shop-response.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';

@Controller('print-shop')
@ApiTags('Print Shop')
export class PrintShopController {
  constructor(private readonly printShopService: PrintShopService) {}

  @Get()
  @ApiOperation({
    summary: '인쇄소 목록 조회',
    description: '인쇄소 목록을 조회하는 API입니다. 페이지네이션을 지원합니다.',
  })
  @ApiOkResponse({
    description: '인쇄소 목록 조회 성공',
    type: PrintShopResponseDto,
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
  @ApiQuery({
    name: 'tagIds',
    required: false,
    description:
      '태그 ID 목록입니다. 태그 ID 목록을 지정하면, 해당 태그와 연관된 인쇄소를 가져옵니다.',
    type: [Number],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
    @Query('searchText') searchText?: string,
    @Query('tagIds', new ParseOptionalArrayPipe()) tagIds?: number[],
  ): Promise<PrintShopResponseDto> {
    return await this.printShopService.findAll(page, size, searchText, tagIds);
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
    type: PrintShop,
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
    @Body(new ValidationPipe()) printShop: UpdatePrintShopDto,
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
}
