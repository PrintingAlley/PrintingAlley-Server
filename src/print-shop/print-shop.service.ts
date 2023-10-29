import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { PrintShopsResponseDto } from './dto/print-shop-response.dto';
import { PrintShopReviewService } from 'src/print-shop-review/print-shop-review.service';
import { ProductService } from 'src/product/product.service';
import { BookmarkService } from 'src/bookmark/bookmark.service';

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
    private readonly bookmarkService: BookmarkService,
    private readonly productService: ProductService,
    private readonly printShopReviewService: PrintShopReviewService,
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
      relations: ['products', 'products.category', 'reviews'],
    });
    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    return printShop;
  }

  async create(createPrintShopDto: CreatePrintShopDto): Promise<PrintShop> {
    const printShop = this.printShopRepository.create(createPrintShopDto);
    return this.printShopRepository.save(printShop);
  }

  async update(id: number, updateData: CreatePrintShopDto): Promise<PrintShop> {
    await this.printShopRepository.update(id, updateData);
    const updatedPrintShop = await this.printShopRepository.findOneBy({ id });
    if (!updatedPrintShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }
    return updatedPrintShop;
  }

  async delete(id: number): Promise<void> {
    const printShop = await this.findOne(id);
    if (!printShop) {
      throw new NotFoundException(`인쇄사 ID ${id}를 찾을 수 없습니다.`);
    }

    // 인쇄사와 연관된 북마크 삭제
    await this.bookmarkService.deleteBookmarksByPrintShopId(id);

    // 인쇄사에 등록된 제품 삭제
    await this.productService.deleteByPrintShopId(id);

    // 인쇄사 리뷰 삭제
    await this.printShopReviewService.deleteByPrintShopId(id);

    // TODO: 전체적인 삭제 로직을 transaction으로 묶기

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
