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

type FindAllParams = {
  page: number;
  size: number;
  searchText?: string;
};

@Injectable()
export class PrintShopService {
  constructor(
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(
    page: number,
    size: number,
    searchText?: string,
  ): Promise<PrintShopsResponseDto> {
    if (page < 1) {
      throw new NotFoundException('page는 1보다 커야 합니다.');
    }

    return this.findAllPrintShops({ page, size, searchText });
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
        if (await this.isCategoryTag(tag, '인쇄종류')) {
          return tag.name;
        }
      }),
    );

    const afterProcessTags = await Promise.all(
      printShop.tags.map(async (tag: Tag) => {
        if (await this.isCategoryTag(tag, '후가공')) {
          return tag.name;
        }
      }),
    );

    printShop.printType = printTypeTags.filter(Boolean).join(', ');
    printShop.afterProcess = afterProcessTags.filter(Boolean).join(', ');

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

  private async findAllPrintShops(
    params: FindAllParams,
  ): Promise<PrintShopsResponseDto> {
    const queryBuilder = this.buildQuery(params);
    const [printShops, totalCount] = await this.executePaginatedQuery(
      queryBuilder,
      params.page,
      params.size,
    );
    return { printShops, totalCount };
  }

  private buildQuery(params: FindAllParams) {
    const queryBuilder =
      this.printShopRepository.createQueryBuilder('printShop');

    if (params.searchText) {
      queryBuilder.where('printShop.name ILIKE :searchText', {
        searchText: `%${params.searchText}%`,
      });
    }

    return queryBuilder;
  }

  private async executePaginatedQuery(
    queryBuilder: any,
    page: number,
    size: number,
  ) {
    const [printShops, totalCount] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
    return [printShops, totalCount];
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
