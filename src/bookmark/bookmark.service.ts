import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PrintShop } from 'src/entity/print-shop.entity';
import { CreateBookmarkGroupDto } from './dto/create-bookmark-group.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(BookmarkGroup)
    private readonly groupRepository: Repository<BookmarkGroup>,
  ) {}

  // 유저의 모든 북마크 그룹 가져오기
  async getBookmarkGroupsByUser(userId: number): Promise<BookmarkGroup[]> {
    return await this.groupRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 북마크 그룹 ID로 북마크 그룹 가져오기
  async getBookmarkGroupById(groupId: number): Promise<BookmarkGroup> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: [
        'bookmarks',
        'bookmarks.printShop',
        'bookmarks.printShop.tags',
      ],
    });

    if (!group) {
      throw new NotFoundException(
        `북마크 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }

    return group;
  }

  // 북마크 그룹 생성
  async createBookmarkGroup(
    data: CreateBookmarkGroupDto,
    userId: number,
  ): Promise<BookmarkGroup> {
    // 이미 같은 이름의 그룹이 있는지 확인
    const existing = await this.groupRepository.findOne({
      where: { name: data.name, user: { id: userId } },
    });
    if (existing) {
      throw new HttpException('이미 같은 이름의 그룹이 있습니다.', 400);
    }

    const group = this.groupRepository.create({
      name: data.name,
      user: { id: userId },
    });
    return await this.groupRepository.save(group);
  }

  // 북마크 그룹 수정
  async updateBookmarkGroup(
    groupId: number,
    data: CreateBookmarkGroupDto,
  ): Promise<BookmarkGroup> {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new NotFoundException(
        `북마크 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }
    group.name = data.name;
    return await this.groupRepository.save(group);
  }

  // 북마크 그룹 삭제
  async deleteBookmarkGroup(groupId: number): Promise<void> {
    // 해당 그룹에 연결된 모든 북마크를 찾습니다.

    const bookmarks = await this.bookmarkRepository.find({
      where: { bookmarkGroup: { id: groupId } },
    });

    // 해당 북마크들을 삭제합니다.
    await this.bookmarkRepository.remove(bookmarks);

    // 북마크 그룹을 삭제합니다.
    const result = await this.groupRepository.delete(groupId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `북마크 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }
  }

  // 여러 북마크 그룹 삭제
  async deleteMultipleBookmarkGroups(groupIds: number[]): Promise<void> {
    // 각 그룹 ID에 대해 연결된 모든 북마크를 찾아 삭제합니다.
    for (const groupId of groupIds) {
      const bookmarks = await this.bookmarkRepository.find({
        where: { bookmarkGroup: { id: groupId } },
      });
      await this.bookmarkRepository.remove(bookmarks);
    }

    // 모든 북마크가 삭제된 후 해당 북마크 그룹들을 삭제합니다.
    await this.groupRepository.delete(groupIds);
  }

  // 북마크 추가
  async addBookmark(
    data: CreateBookmarkDto,
    userId: number,
  ): Promise<Bookmark> {
    if (!data.printShopId) {
      throw new HttpException('인쇄소 ID가 필요합니다.', 400);
    }

    let groupIdToCheck = data.bookmarkGroupId;

    if (!groupIdToCheck) {
      const defaultGroup = await this.getDefaultGroupForUser(userId);
      groupIdToCheck = defaultGroup.id;
    }

    // 이미 북마크가 있는지 확인
    const existing = await this.bookmarkRepository.findOne({
      where: {
        bookmarkGroup: { id: groupIdToCheck },
        printShop: { id: data.printShopId },
      },
    });
    if (existing) {
      throw new HttpException('이미 북마크가 추가되어 있습니다.', 400);
    }

    const printShop = await this.printShopRepository.findOneBy({
      id: data.printShopId,
    });
    if (!printShop) {
      throw new HttpException('해당 인쇄소를 찾을 수 없습니다.', 400);
    }

    const bookmark = new Bookmark();
    bookmark.printShop = printShop;

    if (data.bookmarkGroupId) {
      const group = await this.groupRepository.findOneBy({
        id: data.bookmarkGroupId,
      });
      if (!group) {
        throw new HttpException('해당 북마크 그룹을 찾을 수 없습니다.', 400);
      }
      bookmark.bookmarkGroup = group;
    } else {
      bookmark.bookmarkGroup = await this.getDefaultGroupForUser(userId);
    }

    return await this.bookmarkRepository.save(bookmark);
  }

  // 북마크에 그룹 연결
  async connectGroupToBookmark(
    bookmarkId: number,
    groupId: number,
  ): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id: bookmarkId },
      relations: ['printShop'],
    });
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!bookmark || !group) {
      throw new HttpException('북마크 또는 그룹을 찾을 수 없습니다.', 400);
    }

    await this.ensureGroupNotConnected(bookmarkId, groupId);
    await this.ensurePrintShopNotConnected(bookmark.printShop.id, groupId);

    bookmark.bookmarkGroup = group;
    return await this.bookmarkRepository.save(bookmark);
  }

  // 북마크 삭제
  async deleteBookmark(bookmarkId: number): Promise<void> {
    const result = await this.bookmarkRepository.delete(bookmarkId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `북마크 ID ${bookmarkId}를 찾을 수 없습니다.`,
      );
    }
  }

  // 여러 북마크 삭제
  async deleteMultipleBookmarks(bookmarkIds: number[]): Promise<void> {
    await this.bookmarkRepository.delete(bookmarkIds);
  }

  // 유저의 기본 북마크 그룹 가져오기 (없으면 생성)
  private async getDefaultGroupForUser(userId: number): Promise<BookmarkGroup> {
    const defaultGroupName = '기본 북마크 그룹';
    let group = await this.groupRepository.findOne({
      where: { name: defaultGroupName, user: { id: userId } },
    });

    if (!group) {
      group = this.groupRepository.create({
        name: defaultGroupName,
        user: { id: userId },
      });
      await this.groupRepository.save(group);
    }

    return group;
  }

  private async ensureGroupNotConnected(
    bookmarkId: number,
    groupId: number,
  ): Promise<void> {
    const existing = await this.bookmarkRepository.findOne({
      where: { bookmarkGroup: { id: groupId }, id: bookmarkId },
    });
    if (existing) {
      throw new HttpException('이미 같은 그룹에 연결되어 있습니다.', 400);
    }
  }

  private async ensurePrintShopNotConnected(
    printShopId: number,
    groupId: number,
  ): Promise<void> {
    const existingPrintShop = await this.bookmarkRepository.findOne({
      where: { bookmarkGroup: { id: groupId }, printShop: { id: printShopId } },
    });
    if (existingPrintShop) {
      throw new HttpException(
        '이미 해당 그룹에 동일한 인쇄소가 있습니다.',
        400,
      );
    }
  }
}
