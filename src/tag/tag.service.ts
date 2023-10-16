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
    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.children', 'children')
      .where('tag.id = :id', { id: tagId })
      .getOne();
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
