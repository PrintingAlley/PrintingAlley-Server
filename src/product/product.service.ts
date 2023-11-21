import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Product } from 'src/entity/product.entity';
import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Tag } from 'src/entity/tag.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsResponseDto } from './dto/product-response.dto';
import { BookmarkService } from './../bookmark/bookmark.service';
import { User } from 'src/entity/user.entity';
import { CreateProductDtoByAdmin } from 'src/admin/dto/create-product.dto';
import { ViewLog } from 'src/entity/view-log.entity';
import {
  AFTER_PROCESS_TAG_NAME,
  PRINT_TYPE_TAG_NAME,
} from 'src/config/constants';
import { ProductReview } from 'src/entity/product-review.entity';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(PrintShop)
    private readonly printShopRepository: Repository<PrintShop>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
    @InjectRepository(ViewLog)
    private readonly viewLogRepository: Repository<ViewLog>,
    private readonly bookmarkService: BookmarkService,
    private readonly tagService: TagService,
  ) {}

  async findAll(
    page: number,
    size: number,
    searchText?: string,
    tagIds?: number[],
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ProductsResponseDto> {
    if (page < 1) {
      throw new BadRequestException('page는 0보다 커야합니다.');
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoin('product.tags', 'tag');

    if (tagIds && tagIds.length) {
      queryBuilder
        .andWhere('tag.id IN (:...tagIds)', { tagIds })
        .groupBy('product.id')
        .having('COUNT(DISTINCT tag.id) = :tagCount', {
          tagCount: tagIds.length,
        });
    }

    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('product.name ILIKE :searchText', {
            searchText: `%${searchText}%`,
          }).orWhere('tag.name ILIKE :searchText', {
            searchText: `%${searchText}%`,
          });
        }),
      );
    }

    if (sortBy !== 'bookmarkCount' && sortBy !== 'reviewCount') {
      queryBuilder.orderBy(
        sortBy ? `product.${sortBy}` : 'product.id',
        sortOrder,
      );
    }

    const products = await queryBuilder.getMany();

    for (const product of products) {
      product.bookmarkCount = await this.bookmarkService.countByProductId(
        product.id,
      );
      product.reviewCount = await this.reviewRepository.count({
        where: { product: { id: product.id } },
      });
    }

    if (sortBy === 'bookmarkCount' || sortBy === 'reviewCount') {
      const sortField =
        sortBy === 'bookmarkCount' ? 'bookmarkCount' : 'reviewCount';
      products.sort((a, b) =>
        sortOrder === 'ASC'
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField],
      );
    }

    const paginatedProducts = products.slice((page - 1) * size, page * size);

    const totalCount = products.length;

    return { products: paginatedProducts, totalCount };
  }

  async findOne(
    id: number,
    userId: number | null,
  ): Promise<{ product: Product; bookmarkId?: number }> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'user',
        'category',
        'printShop',
        'tags',
        'tags.parent',
        'reviews',
      ],
    });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    product.ownerId = product.user.id;
    delete product.user;

    const printTypeTags = await Promise.all(
      product.tags.map(async (tag: Tag) => {
        if (await this.tagService.isCategoryTag(tag, PRINT_TYPE_TAG_NAME)) {
          return tag.name;
        }
      }),
    );

    const afterProcessTags = await Promise.all(
      product.tags.map(async (tag: Tag) => {
        if (await this.tagService.isCategoryTag(tag, AFTER_PROCESS_TAG_NAME)) {
          return tag.name;
        }
      }),
    );

    product.printType = printTypeTags.filter(Boolean).join(', ');
    product.afterProcess = afterProcessTags.filter(Boolean).join(', ');

    const isBookmarked = await this.bookmarkService.isBookmarked(id, userId);
    product.isBookmarked = isBookmarked;

    const bookmarkCount = await this.bookmarkService.countByProductId(id);
    product.bookmarkCount = bookmarkCount;

    const bookmarkId = await this.bookmarkService.getBookmarkIdByProductId(
      id,
      userId,
    );

    return { product, bookmarkId };
  }

  async create(
    productData: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const { categoryId, tagIds, ...restData } = productData;

    const printShop = await this.printShopRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!printShop) {
      throw new NotFoundException('인쇄소를 찾을 수 없습니다.');
    }
    if (printShop.user.id !== userId) {
      throw new ForbiddenException('이 인쇄사에 대한 권한이 없습니다.');
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const product = this.productRepository.create(restData);
    product.user = { id: userId } as User;
    product.printShop = printShop;
    product.category = category;

    if (tagIds && tagIds.length) {
      const tags = await this.tagService.findTagsByIds(tagIds);
      product.tags = tags;
    }

    product.images = [productData.mainImage, ...productData.images];

    return this.productRepository.save(product);
  }

  async update(
    id: number,
    updateData: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const { categoryId, tagIds, ...restData } = updateData;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException('이 제품에 대한 권한이 없습니다.');
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    product.category = category;
    Object.assign(product, restData);

    if (tagIds !== undefined) {
      product.tags = tagIds.length
        ? await this.tagService.findTagsByIds(tagIds)
        : [];
    }

    return this.productRepository.save(product);
  }

  async delete(id: number, userId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException('이 제품에 대한 권한이 없습니다.');
    }

    await this.productRepository.delete(id);
  }

  async createByAdmin(productData: CreateProductDtoByAdmin): Promise<Product> {
    const { categoryId, tagIds, printShopId, ...restData } = productData;

    const printShop = await this.printShopRepository.findOne({
      where: { id: printShopId },
      relations: ['user'],
    });
    if (!printShop) {
      throw new NotFoundException('인쇄소를 찾을 수 없습니다.');
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const product = this.productRepository.create(restData);
    product.user = printShop.user;
    product.printShop = printShop;
    product.category = category;

    if (tagIds && tagIds.length) {
      const tags = await this.tagService.findTagsByIds(tagIds);
      product.tags = tags;
    }

    product.images = [productData.mainImage, ...productData.images];

    return this.productRepository.save(product);
  }

  async updateByAdmin(
    id: number,
    updateData: CreateProductDtoByAdmin,
  ): Promise<Product> {
    const { categoryId, tagIds, printShopId, ...restData } = updateData;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['printShop'],
    });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }
    if (product.printShop.id !== printShopId) {
      throw new ForbiddenException('이 인쇄사에 대한 권한이 없습니다.');
    }

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    product.category = category;
    Object.assign(product, restData);

    if (tagIds !== undefined) {
      product.tags = tagIds.length
        ? await this.tagService.findTagsByIds(tagIds)
        : [];
    }

    return this.productRepository.save(product);
  }

  async increaseViewCount(id: number, userIp: string): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('제품을 찾을 수 없습니다.');
    }

    const lastView = await this.viewLogRepository.findOne({
      where: { productId: id, userIp },
      order: { timestamp: 'DESC' },
    });

    const timeLimit = 1 * 60 * 60 * 1000; // 1시간
    if (!lastView || Date.now() - lastView.timestamp.getTime() > timeLimit) {
      product.viewCount += 1;
      await this.productRepository.save(product);

      await this.viewLogRepository.save({
        productId: id,
        userIp: userIp,
        timestamp: new Date(),
      });
    }
  }
}
