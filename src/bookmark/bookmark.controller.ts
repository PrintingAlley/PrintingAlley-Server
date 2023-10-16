import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { CreateBookmarkGroupDto } from './dto/create-bookmark-group.dto';
import { Bookmark } from 'src/entity/bookmark.entity';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/user.decorator';
import { User } from 'src/entity/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmark')
@ApiTags('Bookmark')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer {JWT 토큰}',
})
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('my-bookmarks')
  @ApiOperation({
    summary: '내 북마크 조회',
    description: '내 북마크를 조회하는 API입니다.',
  })
  @ApiOkResponse({
    description: '내 북마크 조회 성공',
    type: [BookmarkGroup],
  })
  async getMyBookmarks(@GetUser() user: User): Promise<BookmarkGroup[]> {
    return this.bookmarkService.getBookmarksByUser(user.id);
  }

  @Post()
  @ApiOperation({
    summary: '북마크 추가',
    description:
      '북마크를 추가하는 API입니다. bookmarkGroupId은 옵션입니다. 생략하면 기본 그룹에 추가됩니다.',
  })
  @ApiOkResponse({
    description: '북마크 추가 성공',
    type: Bookmark,
  })
  async addBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @GetUser() user: User,
  ): Promise<Bookmark> {
    return this.bookmarkService.addBookmark(createBookmarkDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '북마크 해제',
    description: '북마크를 해제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 해제 성공',
  })
  async deleteBookmark(@Param('id') id: number): Promise<void> {
    return this.bookmarkService.deleteBookmark(id);
  }

  @Put(':bookmarkId/group/:groupId')
  @ApiOperation({
    summary: '북마크에 그룹 연결',
    description: '북마크에 그룹을 연결하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크에 그룹 연결 성공',
    type: Bookmark,
  })
  async connectGroupToBookmark(
    @Param('bookmarkId') bookmarkId: number,
    @Param('groupId') groupId: number,
  ): Promise<Bookmark> {
    return this.bookmarkService.connectGroupToBookmark(bookmarkId, groupId);
  }

  @Post('group')
  @ApiOperation({
    summary: '북마크 그룹 생성',
    description: '북마크 그룹을 생성하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 그룹 생성 성공',
    type: BookmarkGroup,
  })
  async createBookmarkGroup(
    @Body() createBookmarkGroupDto: CreateBookmarkGroupDto,
    @GetUser() user: User,
  ): Promise<BookmarkGroup> {
    return this.bookmarkService.createBookmarkGroup(
      createBookmarkGroupDto,
      user.id,
    );
  }

  @Delete('group/:id')
  @ApiOperation({
    summary: '북마크 그룹 삭제',
    description: '북마크 그룹을 삭제하는 API입니다.',
  })
  @ApiOkResponse({
    description: '북마크 그룹 삭제 성공',
  })
  async deleteBookmarkGroup(@Param('id') id: number): Promise<void> {
    return this.bookmarkService.deleteBookmarkGroup(id);
  }
}