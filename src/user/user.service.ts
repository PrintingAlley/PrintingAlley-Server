import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookmarkGroup } from 'src/entity/bookmark-group.entity';
import { Bookmark } from 'src/entity/bookmark.entity';
import { ProductReview } from 'src/entity/product-review.entity';
import { User } from 'src/entity/user.entity';
import { ProductReviewService } from 'src/product-review/product-review.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(BookmarkGroup)
    private readonly bookmarkGroupRepository: Repository<BookmarkGroup>,
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
    // TODO: 사용자의 북마크 삭제 로직을 bookmark.service.ts로 이동
    const userBookmarkGroups = await this.bookmarkGroupRepository.find({
      where: { user: { id: userId } },
    });

    for (const group of userBookmarkGroups) {
      await this.bookmarkRepository.delete({ bookmarkGroup: { id: group.id } });
    }

    await this.bookmarkGroupRepository.remove(userBookmarkGroups);

    // TODO: 사용자가 작성한 인쇄사 리뷰 삭제

    // 사용자가 작성한 제품 리뷰 삭제
    await this.productReviewService.deleteByUserId(userId);

    // TODO: 사용자가 관리하는 인쇄사 삭제

    // TODO: 전체적인 삭제 로직을 transaction으로 묶기

    await this.userRepository.delete(userId);
  }
}
