import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Notice {
  @ApiProperty({
    description: '공지 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '공지 제목',
    required: true,
    example: '공지사항',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: '공지 내용',
    required: true,
    example: '공지 내용입니다.',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
