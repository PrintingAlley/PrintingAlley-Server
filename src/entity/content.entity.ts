import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Content {
  @ApiProperty({
    description: '콘텐츠 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '콘텐츠 제목',
    required: true,
    example: '새로운 콘텐츠',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: '콘텐츠 내용',
    required: true,
    example: '콘텐츠 내용입니다.',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
