import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookmarkGroup } from './bookmark-group.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class Bookmark {
  @ApiProperty({
    description: '북마크 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '제품',
    type: () => Product,
  })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({
    description: '북마크 그룹',
    type: () => BookmarkGroup,
  })
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
