import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      const name = `${userCount + 1}번째 골목 대장`;
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

  // 이름 수정
  async updateName(userId: number, name: string): Promise<User> {
    await this.userRepository.update(userId, { name });
    return this.userRepository.findOneBy({ id: userId });
  }

  // 사용자 삭제
  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
