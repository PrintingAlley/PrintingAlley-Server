import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopReviewDto } from './dto/create-print-shop-review.dto';

@Injectable()
export class PrintShopReviewService {
  constructor(
    @InjectRepository(PrintShopReview)
    private readonly printShopReviewRepository: Repository<PrintShopReview>,
  ) {}

  async findAll(): Promise<PrintShopReview[]> {
    return await this.printShopReviewRepository.find({
      relations: ['printShop', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByPrintShopId(printShopId: number): Promise<PrintShopReview[]> {
    return await this.printShopReviewRepository.find({
      where: { printShop: { id: printShopId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: number): Promise<PrintShopReview[]> {
    return await this.printShopReviewRepository.find({
      where: { user: { id: userId } },
      relations: ['printShop'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PrintShopReview> {
    return await this.printShopReviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(
    printShopId: number,
    userId: number,
    reviewData: CreatePrintShopReviewDto,
  ): Promise<PrintShopReview> {
    const printShopReview = await this.printShopReviewRepository.save({
      ...reviewData,
      printShop: { id: printShopId },
      user: { id: userId },
    });
    return await this.printShopReviewRepository.findOne({
      where: { id: printShopReview.id },
      relations: ['user'],
    });
  }

  async update(
    reviewId: number,
    userId: number,
    reviewData: CreatePrintShopReviewDto,
  ): Promise<PrintShopReview> {
    const printShopReview = await this.printShopReviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });
    if (!printShopReview) {
      throw new NotFoundException('사용자가 작성한 리뷰를 찾을 수 없습니다.');
    }

    await this.printShopReviewRepository.update(
      { id: reviewId },
      { ...reviewData },
    );
    return await this.printShopReviewRepository.findOne({
      where: { id: reviewId },
    });
  }

  async delete(reviewId: number, userId: number): Promise<void> {
    const printShopReview = await this.printShopReviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });
    if (!printShopReview) {
      throw new NotFoundException('사용자가 작성한 리뷰를 찾을 수 없습니다.');
    }

    await this.printShopReviewRepository.softDelete({ id: reviewId });
  }

  async countByPrintShopId(printShopId: number): Promise<number> {
    return await this.printShopReviewRepository.count({
      where: { printShop: { id: printShopId } },
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.printShopReviewRepository.count({
      where: { user: { id: userId } },
    });
  }
}
