import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShopReview } from 'src/entity/print-shop-review.entity';
import { ProductReview } from 'src/entity/product-review.entity';
import { User, UserType } from 'src/entity/user.entity';
import { PrintShopReviewService } from 'src/print-shop-review/print-shop-review.service';
import { ProductReviewService } from 'src/product-review/product-review.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCounter } from 'src/entity/user-counter.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCounter)
    private readonly userCounterRepository: Repository<UserCounter>,
    private readonly printShopReviewService: PrintShopReviewService,
    private readonly productReviewService: ProductReviewService,
  ) {}

  async findOrCreate(
    socialId: string,
    accessToken: string,
    provider: string,
    realName: string,
    email: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { socialId, provider },
    });
    if (!user) {
      const userCounter = await this.retrieveNextUserCounter();
      const name = `${userCounter}번째 골목대장`;
      user = this.userRepository.create({
        socialId,
        accessToken,
        provider,
        name,
        email,
        realName,
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
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['printShops'],
    });
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

  // 프로필 수정
  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { name } = updateUserDto;

    updateUserDto.name = name.trim();
    if (!updateUserDto.name) {
      throw new BadRequestException('이름을 입력해주세요.');
    }

    const user = await this.userRepository.findOneBy({ name });
    if (user) {
      throw new BadRequestException('이미 같은 이름이 존재합니다.');
    }

    const userCounter = await this.retrieveNextUserCounter();
    if (userCounter <= Number(name.split('번째')[0])) {
      throw new BadRequestException('이름을 변경할 수 없습니다.');
    }

    await this.userRepository.update(userId, updateUserDto);
    return this.userRepository.findOneBy({ id: userId });
  }

  // 이름 수정
  async updateName(userId: number, name: string): Promise<User> {
    name = name.trim();
    if (!name) {
      throw new BadRequestException('이름을 입력해주세요.');
    }

    const user = await this.userRepository.findOneBy({ name });
    if (user) {
      throw new BadRequestException('이미 같은 이름이 존재합니다.');
    }

    const userCounter = await this.retrieveNextUserCounter();
    if (userCounter <= Number(name.split('번째')[0])) {
      throw new BadRequestException('이름을 변경할 수 없습니다.');
    }

    await this.userRepository.update(userId, { name });
    return this.userRepository.findOneBy({ id: userId });
  }

  // 사용자 삭제
  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  // 사용자 Type 변경
  async updateUserType(userId: number, userType: UserType): Promise<User> {
    await this.userRepository.update(userId, { userType });
    return this.userRepository.findOneBy({ id: userId });
  }

  // 몇 번째 사용자인지 조회
  async retrieveNextUserCounter(): Promise<number> {
    let userCounter = await this.userCounterRepository.findOneBy({ id: 1 });

    if (!userCounter) {
      userCounter = this.userCounterRepository.create({ count: 1 });
    } else {
      userCounter.count += 1;
    }

    await this.userCounterRepository.save(userCounter);

    return userCounter.count;
  }
}
