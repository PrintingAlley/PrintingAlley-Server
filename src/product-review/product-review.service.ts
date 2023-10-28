import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from 'src/entity/product-review.entity';
import { Repository } from 'typeorm';
import { CreateProductReviewDto } from './dto/create-product-review.dto';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
  ) {}

  async findAll(): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      relations: ['product', 'user', 'product_review_likes'],
    });
  }

  async findAllByProductId(productId: number): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });
  }

  async findAllByUserId(userId: number): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<ProductReview> {
    return await this.productReviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(
    productId: number,
    userId: number,
    reviewData: CreateProductReviewDto,
  ): Promise<ProductReview> {
    const productReview = await this.productReviewRepository.save({
      ...reviewData,
      product: { id: productId },
      user: { id: userId },
    });
    return await this.productReviewRepository.findOne({
      where: { id: productReview.id },
      relations: ['user'],
    });
  }

  async update(
    reviewId: number,
    userId: number,
    reviewData: CreateProductReviewDto,
  ): Promise<ProductReview> {
    const productReview = await this.productReviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });
    if (!productReview) {
      throw new NotFoundException('사용자가 작성한 리뷰를 찾을 수 없습니다.');
    }

    await this.productReviewRepository.update(
      { id: reviewId },
      { ...reviewData },
    );
    return await this.productReviewRepository.findOne({
      where: { id: reviewId },
    });
  }

  async delete(reviewId: number, userId: number): Promise<void> {
    const productReview = await this.productReviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });
    if (!productReview) {
      throw new NotFoundException('사용자가 작성한 리뷰를 찾을 수 없습니다.');
    }

    await this.productReviewRepository.delete({ id: reviewId });
  }

  async deleteByProductId(productId: number): Promise<void> {
    await this.productReviewRepository.delete({ product: { id: productId } });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.productReviewRepository.delete({ user: { id: userId } });
  }

  async countByProductId(productId: number): Promise<number> {
    return await this.productReviewRepository.count({
      where: { product: { id: productId } },
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.productReviewRepository.count({
      where: { user: { id: userId } },
    });
  }

  async like(reviewId: number, userId: number): Promise<void> {
    await this.productReviewRepository
      .createQueryBuilder()
      .relation(ProductReview, 'product_review_likes')
      .of(reviewId)
      .add(userId);
  }

  async unlike(reviewId: number, userId: number): Promise<void> {
    await this.productReviewRepository
      .createQueryBuilder()
      .relation(ProductReview, 'product_review_likes')
      .of(reviewId)
      .remove(userId);
  }
}
