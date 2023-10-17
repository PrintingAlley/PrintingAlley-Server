import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag({ name, parentId }: CreateTagDto): Promise<Tag> {
    if (parentId) {
      await this.validateParentTag(parentId);
      await this.ensureTagDoesNotExist(name, parentId);
    } else {
      await this.ensureTopLevelTagDoesNotExist(name);
    }

    const tag = this.tagRepository.create({
      name,
      parent: parentId ? { id: parentId } : null,
    });

    return this.tagRepository.save(tag);
  }

  private async validateParentTag(parentId: number): Promise<void> {
    const parentTag = await this.tagRepository.findOneBy({ id: parentId });
    if (!parentTag) {
      throw new NotFoundException('Parent tag not found');
    }
  }

  private async ensureTagDoesNotExist(
    name: string,
    parentId: number,
  ): Promise<void> {
    const existingTag = await this.tagRepository.findOne({
      where: { name, parent: { id: parentId } },
    });

    if (existingTag) {
      throw new HttpException('Tag with the same name already exists', 400);
    }
  }

  private async ensureTopLevelTagDoesNotExist(name: string): Promise<void> {
    const existingTag = await this.tagRepository.findOne({
      where: { name, parent: null },
    });

    if (existingTag) {
      throw new HttpException(
        'Top-level tag with the same name already exists',
        400,
      );
    }
  }

  async getTagHierarchy(tagId: number): Promise<Tag> {
    // Recursive CTE를 사용하여 주어진 태그의 모든 하위 태그를 가져옴
    const recursiveCTE = `
    WITH RECURSIVE hierarchy AS (
      SELECT id, name, image, parent_id
      FROM tag
      WHERE id = $1
      UNION ALL
      SELECT t.id, t.name, t.image, t.parent_id
      FROM tag t
      INNER JOIN hierarchy h ON t.parent_id = h.id
    )
    SELECT * FROM hierarchy;
  `;

    const flatList = await this.tagRepository.query(recursiveCTE, [tagId]);

    // 1차원 배열을 계층 구조로 변환
    const buildTree = (list: any[], parentId = null) => {
      const children = list.filter((tag) => tag.parent_id === parentId);
      children.forEach((child) => {
        child.children = buildTree(list, child.id);
      });
      return children;
    };

    return buildTree(flatList)[0];
  }

  async getTopLevelTags(): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.parent_id IS NULL')
      .getMany();
  }

  async deleteTag(tagId: number): Promise<void> {
    const result = await this.tagRepository.delete(tagId);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID "${tagId}" not found`);
    }
  }
}
