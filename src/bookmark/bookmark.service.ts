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
      relations: ['bookmarks'],
    });

    // 각 그룹의 북마크 수를 계산하고 bookmarkCount 필드를 업데이트합니다.
    for (const group of groups) {
      group.bookmarkCount = group.bookmarks.length;
    }

    // 북마크 배열은 필요하지 않으므로 삭제합니다.
    groups.forEach((group) => delete group.bookmarks);

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

  async countByProductId(productId: number): Promise<number> {
    return await this.bookmarkRepository.count({
      where: { product: { id: productId } },
    });
  }

  // 유저 ID로 북마크 및 북마크 그룹 삭제
  async deleteByUserId(userId: number): Promise<void> {
    const userBookmarkGroups = await this.groupRepository.find({
      where: { user: { id: userId } },
    });

    for (const group of userBookmarkGroups) {
      await this.bookmarkRepository.delete({ bookmarkGroup: { id: group.id } });
    }

    await this.groupRepository.remove(userBookmarkGroups);
  }

  // 제품 ID로 북마크 삭제
  async deleteBookmarksByProductId(productId: number): Promise<void> {
    await this.bookmarkRepository.delete({ product: { id: productId } });
  }

  // 인쇄소 ID로 북마크 삭제
  async deleteBookmarksByPrintShopId(printShopId: number): Promise<void> {
    const products = await this.productRepository.find({
      where: { printShop: { id: printShopId } },
    });

    for (const product of products) {
      await this.bookmarkRepository.delete({ product: { id: product.id } });
    }
  }
}
