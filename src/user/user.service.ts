import { BookmarkService } from './../bookmark/bookmark.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { ProductReview } from 'src/entity/product-review.entity';
import { User } from 'src/entity/user.entity';
import { PrintShopReviewService } from 'src/print-shop-review/print-shop-review.service';
import { ProductReviewService } from 'src/product-review/product-review.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bookmarkService: BookmarkService,
    private readonly printShopReviewService: PrintShopReviewService,
    private readonly productReviewService: ProductReviewService,
  ) {}

  async findOrCreate(
    socialId: string,
    accessToken: string,
    provider: string,
    _name: string,
    email: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { socialId, provider },
    });
    if (!user) {
      const userCount = await this.userRepository.count();
      const name = `${userCount + 1}번째 골목대장`;
      user = this.userRepository.create({
        socialId,
        accessToken,
        provider,
        name,
        email,
      });
      await this.userRepository.save(user);
    } else {
      user.accessToken = accessToken;
      await this.userRepository.save(user);
    }
    return user;
  }

  // 소셜 access token 조회
  async getSocialAccessToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['accessToken'],
    });
    return user.accessToken;
  }

  // ID로 사용자 조회
  async getUserById(userId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: userId });
  }

  // 사용자가 작성한 인쇄사 리뷰 조회
  async getPrintShopReviewsByUserId(
    userId: number,
  ): Promise<PrintShopReview[]> {
    return await this.printShopReviewService.findAllByUserId(userId);
  }

  // 사용자가 작성한 제품 리뷰 조회
  async getProductReviewsByUserId(userId: number): Promise<ProductReview[]> {
    return await this.productReviewService.findAllByUserId(userId);
  }

  // 이름 수정
  async updateName(userId: number, name: string): Promise<User> {
    await this.userRepository.update(userId, { name });
    return this.userRepository.findOneBy({ id: userId });
  }

  // 사용자 삭제
  async deleteUser(userId: number): Promise<void> {
    // 사용자와 연결된 북마크 및 북마크 그룹 삭제
    await this.bookmarkService.deleteByUserId(userId);

    // 사용자가 작성한 인쇄사 리뷰 삭제
    await this.printShopReviewService.deleteByUserId(userId);

    // 사용자가 작성한 제품 리뷰 삭제
    await this.productReviewService.deleteByUserId(userId);

    // TODO: 사용자가 관리하는 인쇄사 삭제

    // TODO: 전체적인 삭제 로직을 transaction으로 묶기

    await this.userRepository.delete(userId);
  }
}
