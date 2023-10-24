import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Tag } from 'src/entity/tag.entity';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { createResponse } from 'src/common/utils/response.helper';
import {
  TagResponseDTOForSwagger,
  TagsResponseDTO,
  TagsResponseDTOForSwagger,
} from './dto/tag-response.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({
    summary: '전체 태그 계층 구조 조회',
    description: '전체 태그 계층 구조를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '전체 태그 계층 구조를 성공적으로 가져왔습니다.',
    type: TagsResponseDTOForSwagger,
  })
  async getTags(): Promise<TagsResponseDTO> {
    const hierarchies = await this.tagService.getTags();
    return { hierarchies };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ID로 해당 태그 계층 구조 조회',
    description: 'ID로 해당 태그 계층 구조를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '태그 계층 구조를 성공적으로 가져왔습니다.',
    type: TagResponseDTOForSwagger,
  })
  async getTag(@Param('id') id: number): Promise<Tag> {
    return this.tagService.getTag(id);
  }

  @Post()
  @ApiOperation({
    summary: '태그 생성',
    description:
      '태그를 생성하는 API입니다. 부모 태그 ID와 태그 이미지는 옵션입니다. 부모 태그가 없다면, 해당 태그는 최상위 태그가 됩니다.',
  })
  @ApiOkResponse({
    description: '태그가 성공적으로 생성되었습니다.',
    type: CommonResponseDto,
  })
  async createTag(
    @Body(new ValidationPipe()) createTagDto: CreateTagDto,
  ): Promise<CommonResponseDto> {
    const tag = await this.tagService.createTag(createTagDto);
    return createResponse(200, '성공', tag.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: '태그 수정',
    description: '태그를 수정하는 API입니다. 모든 필드는 옵션입니다.',
  })
  @ApiOkResponse({
    description: '태그가 성공적으로 수정되었습니다.',
    type: CommonResponseDto,
  })
  async updateTag(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateTagDto: UpdateTagDto,
  ): Promise<CommonResponseDto> {
    await this.tagService.updateTag(id, updateTagDto);

    return createResponse(200, '성공', id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '태그 삭제',
    description: '태그를 삭제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '태그가 성공적으로 삭제되었습니다.',
    type: CommonResponseDto,
  })
  async deleteTag(@Param('id') id: number): Promise<CommonResponseDto> {
    await this.tagService.deleteTag(id);
    return createResponse(200, '성공', id);
  }
}
