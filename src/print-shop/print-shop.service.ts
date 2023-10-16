import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';
import { Tag } from 'src/entity/tag.entity';

@Injectable()
export class PrintShopService {
  constructor(
    @InjectRepository(PrintShop)
    private printShopRepository: Repository<PrintShop>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(page: number, size: number): Promise<PrintShop[]> {
    if (page < 1)
      throw new HttpException('page should be greater than 0.', 400);
    return await this.printShopRepository.find({
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findOne(id: number): Promise<PrintShop> {
    return await this.printShopRepository.findOneBy({ id });
  }

  async create(printShop: CreatePrintShopDto): Promise<PrintShop> {
    return await this.printShopRepository.save(printShop);
  }

  async update(id: number, printShop: UpdatePrintShopDto): Promise<PrintShop> {
    await this.printShopRepository.update(id, printShop);
    return await this.printShopRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<PrintShop> {
    const printShop = await this.printShopRepository.findOneBy({ id });
    await this.printShopRepository.delete(id);
    return printShop;
  }

  async getPrintShopsByTags(tagIds: number[]): Promise<PrintShop[]> {
    const tags = await this.tagRepository.find({
      where: tagIds.map((id) => ({ id })),
    });

    if (tags.length !== tagIds.length) {
      throw new NotFoundException('One or more tags not found');
    }

    return await this.printShopRepository
      .createQueryBuilder('printShop')
      .innerJoinAndSelect('printShop.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .getMany();
  }

  async addTagsToPrintShop(
    printShopId: number,
    tagIds: number[],
  ): Promise<PrintShop> {
    const printShop = await this.printShopRepository.findOneBy({
      id: printShopId,
    });
    if (!printShop) {
      throw new NotFoundException('PrintShop not found');
    }

    const tags = await this.tagRepository.findByIds(tagIds);
    if (tags.length !== tagIds.length) {
      throw new NotFoundException('One or more tags not found');
    }

    printShop.tags = [...printShop.tags, ...tags];
    return await this.printShopRepository.save(printShop);
  }

  async removeTagsFromPrintShop(
    printShopId: number,
    tagIds: number[],
  ): Promise<PrintShop> {
    const printShop = await this.printShopRepository.findOneBy({
      id: printShopId,
    });
    if (!printShop) {
      throw new NotFoundException('PrintShop not found');
    }

    printShop.tags = printShop.tags.filter((tag) => !tagIds.includes(tag.id));
    return await this.printShopRepository.save(printShop);
  }
}
