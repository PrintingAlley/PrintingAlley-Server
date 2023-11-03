import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { User } from './user.entity';

@Entity()
export class BookmarkGroup {
  @ApiProperty({
    description: '북마크 그룹 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '그룹명',
    required: true,
    example: '명함 북마크',
  })
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.bookmarkGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '북마크', type: () => [Bookmark] })
  @OneToMany(() => Bookmark, (bookmark) => bookmark.bookmarkGroup)
  bookmarks: Bookmark[];

  @ApiProperty({ description: '북마크 개수', example: 3 })
  bookmarkCount?: number;

  @ApiProperty({
    description: '최근 이미지',
    example: 'https://www.printshop.com',
  })
  recentImage?: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
