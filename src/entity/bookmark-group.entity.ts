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
    example: '내 주변 인쇄소',
  })
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.bookmarkGroups)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: '북마크', type: () => [Bookmark] })
  @OneToMany(() => Bookmark, (bookmark) => bookmark.bookmarkGroup)
  bookmarks: Bookmark[];

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
