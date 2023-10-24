import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTags(): Promise<Tag[]> {
    const topLevelTags = await this.getTopLevelTags();
    const hierarchyPromises = topLevelTags.map((tag) =>
      this.fetchHierarchy(tag.id),
    );
    const hierarchies = await Promise.all(hierarchyPromises);
    for (let i = 0; i < topLevelTags.length; i++) {
      topLevelTags[i] = this.buildTree(hierarchies[i])[0];
    }
    return topLevelTags;
  }

  async getTag(tagId: number): Promise<Tag> {
    const flatList = await this.fetchHierarchy(tagId);
    return this.buildTree(flatList)[0];
  }

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

  async updateTag(tagId: number, updateTagDto: UpdateTagDto): Promise<void> {
    const tag = await this.findTagById(tagId);
    await this.updateTagFields(tag, updateTagDto);
    await this.tagRepository.save(tag);
  }

  async deleteTag(tagId: number): Promise<void> {
    const result = await this.tagRepository.delete(tagId);
    if (result.affected === 0) {
      throw new NotFoundException(`ID가 "${tagId}"인 태그를 찾을 수 없습니다.`);
    }
  }

  private getRecursiveCTEQuery(): string {
    return `
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
  }

  private buildTree(list: any[], parentId = null): Tag[] {
    const children = list.filter((tag) => tag.parent_id === parentId);
    children.forEach((child) => {
      child.children = this.buildTree(list, child.id);
    });
    return children;
  }

  private async fetchHierarchy(tagId: number): Promise<Tag[]> {
    const recursiveCTE = this.getRecursiveCTEQuery();
    return this.tagRepository.query(recursiveCTE, [tagId]);
  }

  private async getTopLevelTags(): Promise<Tag[]> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.parent_id IS NULL')
      .getMany();
  }

  private async validateParentTag(parentId: number): Promise<void> {
    const parentTag = await this.findTagById(parentId);
    if (!parentTag) {
      throw new NotFoundException('부모 태그를 찾을 수 없습니다.');
    }
  }

  private async ensureTagDoesNotExist(
    name: string,
    parentId: number,
  ): Promise<void> {
    const existingTag = await this.tagRepository.findOne({
      where: { name, parent: { id: parentId } },
      relations: ['parent'],
    });

    if (existingTag) {
      throw new BadRequestException(
        `이름이 ${name}인 태그는 이미 부모 ID ${parentId} 아래에 있습니다.`,
      );
    }
  }

  private async ensureTopLevelTagDoesNotExist(name: string): Promise<void> {
    const existingTag = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.parent', 'parent')
      .where('tag.name = :name AND tag.parent IS NULL', { name })
      .getOne();

    if (existingTag) {
      throw new BadRequestException(`이름이 ${name}인 태그는 이미 존재합니다.`);
    }
  }

  private async findTagById(tagId: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['parent'],
    });
    if (!tag) {
      throw new NotFoundException(`ID가 "${tagId}"인 태그를 찾을 수 없습니다.`);
    }

    return tag;
  }

  private async updateTagFields(
    tag: Tag,
    updateTagDto: UpdateTagDto,
  ): Promise<void> {
    if (updateTagDto.name !== undefined) {
      await this.updateTagName(tag, updateTagDto.name);
    }
    if (updateTagDto.image !== undefined) {
      tag.image = updateTagDto.image;
    }
  }

  private async updateTagName(tag: Tag, name: string): Promise<void> {
    if (tag.parent) {
      await this.ensureTagDoesNotExist(name, tag.parent.id);
    } else {
      await this.ensureTopLevelTagDoesNotExist(name);
    }
    tag.name = name;
  }
}
