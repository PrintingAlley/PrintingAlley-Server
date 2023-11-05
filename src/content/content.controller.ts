import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import {
  ContentResponseDto,
  ContentsResponseDto,
} from './dto/content.response.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({
    summary: '콘텐츠 목록 조회',
    description: '콘텐츠 목록을 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '콘텐츠 목록 조회 성공',
    type: ContentsResponseDto,
  })
  async getContents(): Promise<ContentsResponseDto> {
    const contents = await this.contentService.getContents();
    return { contents };
  }

  @Get(':id')
  @ApiOperation({
    summary: '콘텐츠 조회',
    description: '콘텐츠를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '콘텐츠 조회 성공',
    type: ContentResponseDto,
  })
  async getContent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContentResponseDto> {
    const content = await this.contentService.getContent(id);
    return { content };
  }

  @Post()
  @ApiOperation({
    summary: '콘텐츠 생성',
    description: '콘텐츠를 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '콘텐츠 생성 성공',
    type: CommonResponseDto,
  })
  async createContent(
    @Body(new ValidationPipe()) contentData: CreateContentDto,
  ): Promise<CommonResponseDto> {
    const content = await this.contentService.createContent(contentData);
    return createResponse(200, '콘텐츠 생성 성공', content.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '콘텐츠 수정',
    description: '콘텐츠를 수정하는 API입니다.',
  })
  @ApiOkResponse({
    description: '콘텐츠 수정 성공',
    type: CommonResponseDto,
  })
  async updateContent(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) contentData: UpdateContentDto,
  ): Promise<CommonResponseDto> {
    await this.contentService.updateContent(id, contentData);
    return createResponse(200, '콘텐츠 수정 성공', id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '콘텐츠 삭제',
    description: '콘텐츠를 삭제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '콘텐츠 삭제 성공',
    type: CommonResponseDto,
  })
  async deleteContent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommonResponseDto> {
    await this.contentService.deleteContent(id);
    return createResponse(200, '콘텐츠 삭제 성공', id);
  }
}
