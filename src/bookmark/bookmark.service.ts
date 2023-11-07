import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { CreateBookmarkGroupDto } from './dto/create-bookmark-group.dto';
import { Product } from 'src/entity/product.entity';
import {
  BookmarkGroupWithHasProduct,
  BookmarkGroupsWithHasProductResponseDto,
} from './dto/bookmark-group.response.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(BookmarkGroup)
    private readonly groupRepository: Repository<BookmarkGroup>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 유저의 모든 북마크 그룹 가져오기
  async getBookmarkGroupsByUser(userId: number): Promise<BookmarkGroup[]> {
    const groups = await this.groupRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['bookmarks', 'bookmarks.product'],
    });

    for (const group of groups) {
      group.bookmarkCount = group.bookmarks.length;

      group.bookmarks.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

      const recentBookmark = group.bookmarks[0];
      if (recentBookmark && recentBookmark.product) {
        group.recentImage = recentBookmark.product.mainImage;
      }

      delete group.bookmarks;
    }

    return groups;
  }

  // 북마크 그룹 ID로 북마크 그룹 가져오기
  async getBookmarkGroupById(groupId: number): Promise<BookmarkGroup> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['bookmarks', 'bookmarks.product', 'bookmarks.product.tags'],
    });

    if (!group) {
      throw new NotFoundException(
        `북마크 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }

    return group;
  }

  // 북마크 그룹에 제품이 포함되어 있는지 여부 가져오기
  async getBookmarkGroupsWithHasProduct(
    productId: number,
    userId: number,
  ): Promise<BookmarkGroupsWithHasProductResponseDto> {
    const groups = await this.groupRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['bookmarks', 'bookmarks.product'],
    });

    const bookmarkGroupsWithHasProduct: BookmarkGroupWithHasProduct[] =
      groups.map((group) => ({
        id: group.id,
        name: group.name,
        hasProduct: group.bookmarks.some(
          (bookmark) => bookmark.product.id === productId,
        ),
        bookmarkId: group.bookmarks.find(
          (bookmark) => bookmark.product.id === productId,
        )?.id,
      }));

    return { bookmarkGroups: bookmarkGroupsWithHasProduct };
  }

  // 북마크 그룹 생성
  async createBookmarkGroup(
    data: CreateBookmarkGroupDto,
    userId: number,
  ): Promise<BookmarkGroup> {
    const existing = await this.checkExistBookmarkGroupName(userId, data.name);
    if (existing) {
      throw new BadRequestException('이미 같은 이름의 그룹이 있습니다.');
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
    userId: number,
  ): Promise<BookmarkGroup> {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new NotFoundException(
        `북마크 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }

    const existing = await this.checkExistBookmarkGroupName(userId, data.name);
    if (existing) {
      throw new BadRequestException('이미 같은 이름의 그룹이 있습니다.');
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
    if (!data.productId) {
      throw new BadRequestException('제품 ID가 필요합니다.');
    }

    let groupIdToCheck = data.groupId;

    if (!groupIdToCheck) {
      const defaultGroup = await this.getDefaultGroupForUser(userId);
      groupIdToCheck = defaultGroup.id;
    }

    // 이미 북마크가 있는지 확인
    const existing = await this.bookmarkRepository.findOne({
      where: {
        bookmarkGroup: { id: groupIdToCheck },
        product: { id: data.productId },
      },
    });
    if (existing) {
      throw new BadRequestException('이미 북마크가 추가되어 있습니다.');
    }

    const product = await this.productRepository.findOneBy({
      id: data.productId,
    });
    if (!product) {
      throw new NotFoundException(
        `제품 ID ${data.productId}를 찾을 수 없습니다.`,
      );
    }

    const bookmark = new Bookmark();
    bookmark.product = product;

    if (data.groupId) {
      const group = await this.groupRepository.findOneBy({
        id: data.groupId,
      });
      if (!group) {
        throw new NotFoundException(
          `북마크 그룹 ID ${data.groupId}를 찾을 수 없습니다.`,
        );
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
      relations: ['product'],
    });
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!bookmark || !group) {
      throw new NotFoundException(
        `북마크 ID ${bookmarkId} 또는 그룹 ID ${groupId}를 찾을 수 없습니다.`,
      );
    }

    await this.ensureGroupNotConnected(bookmarkId, groupId);
    await this.ensureProductNotConnected(bookmark.product.id, groupId);

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
    const defaultGroupName = '기본 그룹';
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
      throw new BadRequestException('이미 같은 그룹에 연결되어 있습니다.');
    }
  }

  private async ensureProductNotConnected(
    productId: number,
    groupId: number,
  ): Promise<void> {
    const existingProduct = await this.bookmarkRepository.findOne({
      where: { bookmarkGroup: { id: groupId }, product: { id: productId } },
    });
    if (existingProduct) {
      throw new BadRequestException('이미 해당 그룹에 동일한 제품이 있습니다.');
    }
  }

  private async checkExistBookmarkGroupName(
    userId: number,
    name: string,
  ): Promise<boolean> {
    const bookmarkGroup = await this.groupRepository.findOne({
      where: { user: { id: userId }, name },
    });
    return !!bookmarkGroup;
  }

  async isBookmarked(
    productId: number,
    userId: number | null,
  ): Promise<boolean> {
    if (!userId) {
      return false;
    }
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        product: { id: productId },
        bookmarkGroup: { user: { id: userId } },
      },
    });
    return !!bookmark;
  }

  async getBookmarkIdByProductId(
    productId: number,
    userId: number | null,
  ): Promise<number | null> {
    if (!userId) {
      return null;
    }
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        product: { id: productId },
        bookmarkGroup: { user: { id: userId } },
      },
    });
    return bookmark?.id || null;
  }

  async countByProductId(productId: number): Promise<number> {
    return await this.bookmarkRepository.count({
      where: { product: { id: productId } },
    });
  }
}
