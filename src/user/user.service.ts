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
    provider: string,
    name: string,
    email: string,
  ): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { socialId, provider },
    });
    if (!user) {
      user = this.userRepository.create({ socialId, provider, name, email });
      await this.userRepository.save(user);
    }
    return user;
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
}
