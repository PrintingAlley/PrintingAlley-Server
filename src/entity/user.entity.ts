import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '소셜 로그인 ID',
    required: true,
    example: '1234567890',
  })
  @Column({ unique: true })
  socialId: string;

  @ApiProperty({
    description: '소셜 로그인 제공업체',
    required: true,
    example: 'google',
  })
  @Column()
  provider: string;

  @ApiProperty({
    description: '이름',
    required: false,
    example: '홍길동',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '이메일',
    required: false,
    example: 'abc@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
