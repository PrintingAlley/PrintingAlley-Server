import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PrintShop } from './print-shop.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
  @ApiProperty({ description: '태그 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '태그 이름', example: '소량인쇄' })
  @Column()
  name: string;

  @ApiProperty({
    description: '태그 이미지',
    required: false,
    example: 'https://www.printshop.com',
  })
  @Column({ nullable: true })
  image: string | null;

  @ApiProperty({ description: '부모 태그', type: () => Tag })
  @ManyToOne(() => Tag, (tag) => tag.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Tag | null;

  @ApiProperty({ description: '자식 태그', type: () => [Tag] })
  @OneToMany(() => Tag, (tag) => tag.parent)
  children: Tag[];

  @ApiProperty({ description: '태그가 연결된 인쇄소', type: () => [PrintShop] })
  @ManyToMany(() => PrintShop, (printShop) => printShop.tags)
  printShops: PrintShop[];

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
