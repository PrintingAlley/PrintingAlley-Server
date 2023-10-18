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
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrintShop } from 'src/entity/print-shop.entity';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';
import { ParseOptionalArrayPipe } from './pipes/parse-optional-array.pipe';
import { PrintShopResponseDto } from './dto/print-shop-response.dto';

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
    type: PrintShop,
  })
  async create(
    @Body(new ValidationPipe()) printShop: CreatePrintShopDto,
  ): Promise<PrintShop> {
    return await this.printShopService.create(printShop);
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
    type: PrintShop,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) printShop: UpdatePrintShopDto,
  ): Promise<PrintShop> {
    return await this.printShopService.update(id, printShop);
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
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.printShopService.delete(id);
  }

  @Post(':id/add-tags')
  @ApiOperation({
    summary: '인쇄소에 태그 추가',
    description: '인쇄소에 태그를 추가하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그가 성공적으로 추가되었습니다.',
  })
  @ApiBody({ description: '태그 ID 목록', type: [Number] })
  async addTagsToPrintShop(
    @Param('id') id: number,
    @Body('tagIds') tagIds: number[],
  ): Promise<PrintShop> {
    return this.printShopService.addTagsToPrintShop(id, tagIds);
  }

  @Post(':id/remove-tags')
  @ApiOperation({
    summary: '인쇄소에서 태그 연결 해제',
    description: '인쇄소에서 태그를 연결 해제하는 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '태그가 성공적으로 연결 해제되었습니다.',
  })
  @ApiBody({ description: '태그 ID 목록', type: [Number] })
  async removeTagsFromPrintShop(
    @Param('id') id: number,
    @Body('tagIds') tagIds: number[],
  ): Promise<PrintShop> {
    return this.printShopService.removeTagsFromPrintShop(id, tagIds);
  }
}
