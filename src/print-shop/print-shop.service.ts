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
import { User } from 'src/entity/user.entity';

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
      relations: ['user', 'products', 'products.category', 'reviews'],
    });
    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    printShop.ownerId = printShop.user.id;
    delete printShop.user;

    return printShop;
  }

  async create(
    createPrintShopDto: CreatePrintShopDto,
    userId: number,
  ): Promise<PrintShop> {
    const existingPrintShop = await this.printShopRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingPrintShop) {
      throw new BadRequestException(
        '사장님은 이미 인쇄사를 소유하고 있습니다.',
      );
    }

    const printShop = this.printShopRepository.create(createPrintShopDto);
    printShop.user = { id: userId } as User;

    return this.printShopRepository.save(printShop);
  }

  async update(
    id: number,
    updateData: CreatePrintShopDto,
    userId: number,
  ): Promise<PrintShop> {
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

    await this.printShopRepository.update(id, updateData);

    const updatedPrintShop = await this.printShopRepository.findOneBy({ id });
    return updatedPrintShop;
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
}
