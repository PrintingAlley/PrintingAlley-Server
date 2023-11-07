import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from 'src/entity/content.entity';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async getContents(): Promise<Content[]> {
    const contents = await this.contentRepository.find({
      order: { createdAt: 'DESC' },
    });

    contents.forEach((content) => {
      content.webViewUrl = `${process.env.CLIENT_URL}/content-webview/${content.id}`;
    });

    return contents;
  }

  async getContent(id: number): Promise<Content> {
    const content = await this.contentRepository.findOneBy({ id });
    if (!content) {
      throw new NotFoundException(`콘텐츠 ID ${id}를 찾을 수 없습니다.`);
    }

    content.webViewUrl = `${process.env.CLIENT_URL}/content-webview/${content.id}`;

    return content;
  }

  async createContent(contentData: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(contentData);
    return this.contentRepository.save(content);
  }

  async updateContent(
    id: number,
    contentData: UpdateContentDto,
  ): Promise<void> {
    const content = await this.contentRepository.findOne({
      where: { id },
    });
    if (!content) {
      throw new NotFoundException(`콘텐츠 ID ${id}를 찾을 수 없습니다.`);
    }

    await this.contentRepository.update(id, contentData);
  }

  async deleteContent(id: number): Promise<void> {
    const content = await this.contentRepository.findOne({
      where: { id },
    });
    if (!content) {
      throw new NotFoundException(`콘텐츠 ID ${id}를 찾을 수 없습니다.`);
    }

    await this.contentRepository.delete(id);
  }
}
