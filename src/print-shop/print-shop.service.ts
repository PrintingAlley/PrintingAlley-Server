import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';
import { Tag } from 'src/entity/tag.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { PrintShopResponseDto } from './dto/print-shop-response.dto';

@Injectable()
export class PrintShopService {
  constructor(
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  async findAll(
    page: number,
    size: number,
    searchText?: string,
    tagIds?: number[],
  ): Promise<PrintShopResponseDto> {
    if (page < 1)
      throw new HttpException('Page should be greater than 0.', 400);

    return tagIds && tagIds.length
      ? await this.getPrintShopsByTags(page, size, tagIds, searchText)
      : await this.findAllPrintShops(page, size, searchText);
  }

  async findOne(id: number): Promise<PrintShop> {
    return this.printShopRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
  }

  async create(printShopData: CreatePrintShopDto): Promise<PrintShop> {
    const { tagIds, ...restData } = printShopData;

    const printShop = this.printShopRepository.create(restData);

    if (tagIds && tagIds.length) {
      const tags = await this.findTagsByIds(tagIds);
      printShop.tags = tags;
    }

    return this.printShopRepository.save(printShop);
  }

  async update(id: number, updateData: UpdatePrintShopDto): Promise<PrintShop> {
    const { tagIds, ...restData } = updateData;

    await this.printShopRepository.update(id, restData);
    const printShop = await this.findOne(id);

    if (tagIds !== undefined) {
      printShop.tags = tagIds.length ? await this.findTagsByIds(tagIds) : [];
      await this.printShopRepository.save(printShop);
    }

    return printShop;
  }

  async delete(id: number): Promise<void> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { printShop: { id } },
    });
    await this.bookmarkRepository.remove(bookmarks);

    await this.printShopRepository.delete(id);
  }

  async addTagsToPrintShop(
    printShopId: number,
    tagIds: number[],
  ): Promise<PrintShop> {
    const printShop = await this.findOne(printShopId);
    const tags = await this.findTagsByIds(tagIds);

    printShop.tags = [...(printShop.tags || []), ...tags];
    return this.printShopRepository.save(printShop);
  }

  async removeTagsFromPrintShop(
    printShopId: number,
    tagIds: number[],
  ): Promise<PrintShop> {
    const printShop = await this.findOne(printShopId);
    printShop.tags = printShop.tags.filter((tag) => !tagIds.includes(tag.id));
    return this.printShopRepository.save(printShop);
  }

  private async findAllPrintShops(
    page: number,
    size: number,
    searchText?: string,
  ): Promise<PrintShopResponseDto> {
    const queryBuilder =
      this.printShopRepository.createQueryBuilder('printShop');

    if (searchText) {
      queryBuilder.where('printShop.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    const totalCount = await queryBuilder.getCount();

    const printShops = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .leftJoinAndSelect('printShop.tags', 'tags')
      .getMany();

    return { printShops, totalCount };
  }

  private async getPrintShopsByTags(
    page: number,
    size: number,
    tagIds: number[],
    searchText?: string,
  ): Promise<PrintShopResponseDto> {
    await this.findTagsByIds(tagIds);

    const queryBuilder = this.printShopRepository
      .createQueryBuilder('printShop')
      .innerJoin('printShop.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .groupBy('printShop.id')
      .having('COUNT(DISTINCT tag.id) = :tagCount', { tagCount: tagIds.length })
      .skip((page - 1) * size)
      .take(size);

    if (searchText) {
      queryBuilder.andWhere('printShop.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    const totalCount = await queryBuilder.getCount();
    const printShops = await queryBuilder.getMany();

    return { printShops, totalCount };
  }

  private async findTagsByIds(tagIds: number[]): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      where: tagIds.map((id) => ({ id })),
    });
    if (tags.length !== tagIds.length) {
      throw new NotFoundException('One or more tags not found');
    }
    return tags;
  }
}
