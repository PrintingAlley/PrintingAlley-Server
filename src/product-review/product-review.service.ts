import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from 'src/entity/product-review.entity';
import { Repository } from 'typeorm';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import * as BadWordsFilter from 'badwords-ko';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private readonly productReviewRepository: Repository<ProductReview>,
  ) {}
  private filter = new BadWordsFilter();

  async findAll(): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByProductId(productId: number): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: number): Promise<ProductReview[]> {
    return await this.productReviewRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
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
    if (!reviewData.content.replace(/\s/g, '').length) {
      throw new NotFoundException('리뷰 내용을 입력해주세요.');
    }
    const filteredContent = this.filter.clean(reviewData.content);
    const productReview = await this.productReviewRepository.save({
      ...reviewData,
      content: filteredContent,
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

    if (!reviewData.content.replace(/\s/g, '').length) {
      throw new NotFoundException('리뷰 내용을 입력해주세요.');
    }
    const filteredContent = this.filter.clean(reviewData.content);
    await this.productReviewRepository.update(
      { id: reviewId },
      { ...reviewData, content: filteredContent },
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
}
