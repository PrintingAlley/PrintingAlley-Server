import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkGroup } from './bookmark-group.entity';
import { PrintShop } from './print-shop.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Bookmark {
  @ApiProperty({
    description: '북마크 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '인쇄소',
    type: () => PrintShop,
  })
  @ManyToOne(() => PrintShop)
  @JoinColumn({ name: 'print_shop_id' })
  printShop: PrintShop;

  @ManyToOne(() => BookmarkGroup, (group) => group.bookmarks)
  @JoinColumn({ name: 'bookmark_group_id' })
  bookmarkGroup: BookmarkGroup;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
