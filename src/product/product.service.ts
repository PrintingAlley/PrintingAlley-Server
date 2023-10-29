import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entity/product.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Tag } from 'src/entity/tag.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsResponseDto } from './dto/product-response.dto';
import { ProductReviewService } from 'src/product-review/product-review.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly productReviewService: ProductReviewService,
  ) {}

  async findAll(
    page: number,
    size: number,
    searchText?: string,
    tagIds?: number[],
  ): Promise<ProductsResponseDto> {
    if (page < 1) {
      throw new BadRequestException('page는 0보다 커야합니다.');
    }

    return tagIds && tagIds.length
      ? await this.getProductsByTags(page, size, tagIds, searchText)
      : await this.findAllProducts(page, size, searchText);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'printShop', 'tags', 'reviews'],
    });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    const bookmarkCount = await this.bookmarkRepository.count({
      where: { product: { id } },
    });
    product.bookmarkCount = bookmarkCount;

    return product;
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const { categoryId, printShopId, tagIds, ...restData } = productData;

    const product = this.productRepository.create(restData);

    const [category, printShop] = await Promise.all([
      this.categoryRepository.findOneBy({ id: categoryId }),
      this.printShopRepository.findOneBy({ id: printShopId }),
    ]);

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    if (!printShop) {
      throw new NotFoundException('인쇄소를 찾을 수 없습니다.');
    }

    product.category = category;
    product.printShop = printShop;

    if (tagIds && tagIds.length) {
      const tags = await this.findTagsByIds(tagIds);
      product.tags = tags;
    }

    return this.productRepository.save(product);
  }

  async update(id: number, updateData: CreateProductDto): Promise<Product> {
    const { categoryId, printShopId, tagIds, ...restData } = updateData;

    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    const [category, printShop] = await Promise.all([
      this.categoryRepository.findOneBy({ id: categoryId }),
      this.printShopRepository.findOneBy({ id: printShopId }),
    ]);

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    if (!printShop) {
      throw new NotFoundException('인쇄소를 찾을 수 없습니다.');
    }

    product.category = category;
    product.printShop = printShop;

    await this.productRepository.update(id, restData);

    if (tagIds !== undefined) {
      product.tags = tagIds.length ? await this.findTagsByIds(tagIds) : [];
      await this.productRepository.save(product);
    }

    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    // 제품에 대한 북마크 삭제
    const bookmarks = await this.bookmarkRepository.find({
      where: { product: { id } },
    });
    await this.bookmarkRepository.remove(bookmarks);

    //  제품 리뷰 삭제
    await this.productReviewService.deleteByProductId(id);

    await this.productRepository.delete(id);
  }

  async deleteByPrintShopId(printShopId: number): Promise<void> {
    const products = await this.productRepository.find({
      where: { printShop: { id: printShopId } },
    });

    for (const product of products) {
      await this.delete(product.id);
    }
  }

  private async findAllProducts(
    page: number,
    size: number,
    searchText?: string,
  ): Promise<ProductsResponseDto> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (searchText) {
      queryBuilder.where('product.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    const totalCount = await queryBuilder.getCount();

    const products = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .leftJoinAndSelect('product.tags', 'tags')
      .getMany();

    return { products, totalCount };
  }

  private async getProductsByTags(
    page: number,
    size: number,
    tagIds: number[],
    searchText?: string,
  ): Promise<ProductsResponseDto> {
    await this.findTagsByIds(tagIds);

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .groupBy('product.id')
      .having('COUNT(DISTINCT tag.id) = :tagCount', { tagCount: tagIds.length })
      .skip((page - 1) * size)
      .take(size);

    if (searchText) {
      queryBuilder.andWhere('product.name ILIKE :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    const totalCount = await queryBuilder.getCount();
    const products = await queryBuilder.getMany();

    return { products, totalCount };
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
}
