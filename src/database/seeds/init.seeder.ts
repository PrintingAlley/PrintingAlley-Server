import {
  AFTER_PROCESS_TAG_NAME,
  PRINT_TYPE_TAG_NAME,
} from 'src/config/constants';
import { Category } from 'src/entity/category.entity';
import { Tag } from 'src/entity/tag.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const categories = [
  {
    name: '포스터',
    image: 'https://printingstreets.uk/518.png',
  },
  {
    name: '리플렛',
    image: 'https://printingstreets.uk/519.png',
  },
  {
    name: '명함',
    image: 'https://printingstreets.uk/520.png',
  },
  {
    name: '엽서/카드',
    image: 'https://printingstreets.uk/521.png',
  },
  {
    name: '소책자',
    image: 'https://printingstreets.uk/522.png',
  },
  {
    name: '책',
    image: 'https://printingstreets.uk/523.png',
  },
];

const runTagSeeder = async (dataSource: DataSource) => {
  const tagRepository = dataSource.getRepository(Tag);

  // For each category, create the tag and its children
  for (const categoryItem of categories) {
    const category = await tagRepository.save({
      name: categoryItem.name,
      image: categoryItem.image,
    });

    // Top-level tags
    const printType = await tagRepository.save({
      name: PRINT_TYPE_TAG_NAME,
      parent: category,
    });
    const postProcessing = await tagRepository.save({
      name: AFTER_PROCESS_TAG_NAME,
      parent: category,
    });

    // Children for 인쇄 방식
    const commercialPrint = await tagRepository.save({
      name: '상업인쇄',
      parent: printType,
    });
    await tagRepository.save({ name: '디지털인쇄', parent: commercialPrint });
    await tagRepository.save({ name: '옵셋인쇄', parent: commercialPrint });
    await tagRepository.save({ name: 'UV인쇄', parent: commercialPrint });
    await tagRepository.save({ name: '마스터인쇄', parent: commercialPrint });

    const specialPrint = await tagRepository.save({
      name: '특수인쇄',
      parent: printType,
    });
    await tagRepository.save({ name: '리소인쇄', parent: specialPrint });
    await tagRepository.save({ name: '레터프레스', parent: specialPrint });

    // Children for 후가공
    const cutting = await tagRepository.save({
      name: '커팅',
      parent: postProcessing,
    });
    await tagRepository.save({ name: '재단', parent: cutting });
    await tagRepository.save({ name: '도무송', parent: cutting });
    await tagRepository.save({ name: '귀돌이', parent: cutting });

    const lines = await tagRepository.save({
      name: '선',
      parent: postProcessing,
    });
    await tagRepository.save({ name: '오시/접는 선', parent: lines });
    await tagRepository.save({ name: '미싱/자르는 선', parent: lines });

    const others = await tagRepository.save({
      name: '기타',
      parent: postProcessing,
    });
    await tagRepository.save({ name: '접지', parent: others });
    await tagRepository.save({ name: '코팅', parent: others });
    await tagRepository.save({ name: '타공', parent: others });
    await tagRepository.save({ name: '박', parent: others });
    await tagRepository.save({ name: '형압', parent: others });
    await tagRepository.save({ name: '에폭시', parent: others });

    const binding = await tagRepository.save({
      name: '제본',
      parent: postProcessing,
    });
    await tagRepository.save({ name: '무선', parent: binding });
    await tagRepository.save({ name: '중철', parent: binding });
    await tagRepository.save({ name: '스프링', parent: binding });
    await tagRepository.save({ name: '양장', parent: binding });
    await tagRepository.save({ name: '반양장', parent: binding });
    await tagRepository.save({ name: '누드/사철', parent: binding });
    await tagRepository.save({ name: '실/미싱', parent: binding });
    await tagRepository.save({ name: '떡/낱장', parent: binding });
    await tagRepository.save({ name: 'PUR', parent: binding });
  }

  return tagRepository.find();
};

export default class DemoSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const categoryRepository = dataSource.getRepository(Category);

    await categoryRepository.save(categories);
    await runTagSeeder(dataSource);

    console.log('Init seed data has been inserted');
  }
}
