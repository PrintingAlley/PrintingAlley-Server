import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { PrintShopsResponseDto } from './dto/print-shop-response.dto';
import { User, UserType } from 'src/entity/user.entity';
import { Tag } from 'src/entity/tag.entity';
import { ViewLog } from 'src/entity/view-log.entity';
import {
  AFTER_PROCESS_BINDING_TAG_NAME,
  AFTER_PROCESS_TAG_NAME,
  PRINT_TYPE_TAG_NAME,
} from 'src/config/constants';

@Injectable()
export class PrintShopService {
  constructor(
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(ViewLog)
    private readonly viewLogRepository: Repository<ViewLog>,
  ) {}

  async findAll(
    page: number,
    size: number,
    searchText?: string,
    tagIds?: number[],
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PrintShopsResponseDto> {
    if (page < 1) {
      throw new NotFoundException('page는 1보다 커야 합니다.');
    }

    return tagIds && tagIds.length
      ? await this.getPrintShopsByTags(
          page,
          size,
          tagIds,
          searchText,
          sortBy,
          sortOrder,
        )
      : await this.findAllPrintShops(page, size, searchText, sortBy, sortOrder);
  }

  async findOne(id: number): Promise<PrintShop> {
    const printShop = await this.printShopRepository.findOne({
      where: { id },
      relations: ['user', 'tags', 'products', 'products.category', 'reviews'],
    });
    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    printShop.ownerId = printShop.user.id;
    delete printShop.user;

    const printTypeTags = await Promise.all(
      printShop.tags.map(async (tag: Tag) => {
        if (await this.isCategoryTag(tag, PRINT_TYPE_TAG_NAME)) {
          return tag.name;
        }
      }),
    );

    const afterProcessBindingTags = await Promise.all(
      printShop.tags.map(async (tag: Tag) => {
        if (await this.isCategoryTag(tag, AFTER_PROCESS_BINDING_TAG_NAME)) {
          return tag.name;
        }
      }),
    );

    const afterProcessTags = await Promise.all(
      printShop.tags.map(async (tag: Tag) => {
        if (
          !afterProcessBindingTags.includes(tag.name) &&
          (await this.isCategoryTag(tag, AFTER_PROCESS_TAG_NAME))
        ) {
          return tag.name;
        }
      }),
    );

    printShop.printType = printTypeTags.filter(Boolean).join(', ');
    printShop.afterProcess = afterProcessTags.filter(Boolean).join(', ');
    printShop.afterProcessBinding = afterProcessBindingTags
      .filter(Boolean)
      .join(', ');

    return printShop;
  }

  async create(
    createPrintShopDto: CreatePrintShopDto,
    user: User,
  ): Promise<PrintShop> {
    const { tagIds, ...restData } = createPrintShopDto;

    const existingPrintShop = await this.printShopRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (user.userType !== UserType.ADMIN && existingPrintShop) {
      throw new BadRequestException(
        '사장님은 이미 인쇄사를 소유하고 있습니다.',
      );
    }

    const printShop = this.printShopRepository.create(restData);
    printShop.user = user;

    if (tagIds && tagIds.length) {
      const tags = await this.findTagsByIds(tagIds);
      printShop.tags = tags;
    }

    return this.printShopRepository.save(printShop);
  }

  async update(
    id: number,
    updateData: CreatePrintShopDto,
    userId: number,
  ): Promise<PrintShop> {
    const { tagIds, ...restData } = updateData;

    const printShop = await this.printShopRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    if (printShop.user.id !== userId) {
      throw new ForbiddenException('이 인쇄사에 대한 권한이 없습니다.');
    }

    Object.assign(printShop, restData);

    if (tagIds !== undefined) {
      printShop.tags = tagIds.length ? await this.findTagsByIds(tagIds) : [];
    }

    return this.printShopRepository.save(printShop);
  }

  async delete(id: number, userId: number): Promise<void> {
    const printShop = await this.printShopRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    if (printShop.user.id !== userId) {
      throw new ForbiddenException('이 인쇄사에 대한 권한이 없습니다.');
    }

    await this.printShopRepository.remove(printShop);
  }

  async increaseViewCount(id: number, userIp: string): Promise<void> {
    const printShop = await this.printShopRepository.findOneBy({ id });
    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }

    const lastView = await this.viewLogRepository.findOne({
      where: { printShopId: id, userIp },
      order: { timestamp: 'DESC' },
    });

    const timeLimit = 1 * 60 * 60 * 1000; // 1시간
    if (!lastView || Date.now() - lastView.timestamp.getTime() > timeLimit) {
      printShop.viewCount += 1;
      await this.printShopRepository.save(printShop);

      await this.viewLogRepository.save({
        printShopId: id,
        userIp: userIp,
        timestamp: new Date(),
      });
    }
  }

  private async findAllPrintShops(
    page: number,
    size: number,
    searchText?: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PrintShopsResponseDto> {
    const queryBuilder =
      this.printShopRepository.createQueryBuilder('print_shop');

    if (searchText) {
      queryBuilder.where('print_shop.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    if (sortBy) {
      queryBuilder.orderBy(`print_shop.${sortBy}`, sortOrder);
    }

    const totalCount = await queryBuilder.getCount();
    queryBuilder.skip((page - 1) * size).take(size);
    queryBuilder.leftJoinAndSelect('print_shop.tags', 'tags');
    const printShops = await queryBuilder.getMany();

    return { printShops, totalCount };
  }

  private async getPrintShopsByTags(
    page: number,
    size: number,
    tagIds: number[],
    searchText?: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PrintShopsResponseDto> {
    await this.findTagsByIds(tagIds);

    const queryBuilder = this.printShopRepository
      .createQueryBuilder('print_shop')
      .innerJoin('print_shop.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .groupBy('print_shop.id')
      .having('COUNT(DISTINCT tag.id) = :tagCount', {
        tagCount: tagIds.length,
      });

    if (searchText) {
      queryBuilder.andWhere('print_shop.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    if (sortBy) {
      queryBuilder.orderBy(`print_shop.${sortBy}`, sortOrder);
    }

    const totalCount = await queryBuilder.getCount();
    queryBuilder.skip((page - 1) * size).take(size);
    const printShops = await queryBuilder.getMany();

    return { printShops, totalCount };
  }

  private async findTagsByIds(tagIds: number[]): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      where: tagIds.map((id) => ({ id })),
    });
    if (tags.length !== tagIds.length) {
      throw new NotFoundException('하나 이상의 태그를 찾을 수 없습니다.');
    }
    return tags;
  }

  private async isCategoryTag(
    childTag: Tag,
    categoryName: string,
  ): Promise<boolean> {
    const tag = await this.tagRepository.findOne({
      where: { id: childTag.id },
      relations: ['parent'],
    });

    if (!tag.parent) {
      return false;
    }

    const parent = await this.tagRepository.findOneBy({ id: tag.parent.id });
    if (!parent) {
      return false;
    }

    if (parent.name === categoryName) {
      return true;
    }

    return await this.isCategoryTag(parent, categoryName);
  }
}
