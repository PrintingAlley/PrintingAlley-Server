import { Tag } from 'src/entity/tag.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class TagSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Tag);

    // Top-level tags
    const common = await repository.save({ name: '공통' });
    const businessCard = await repository.save({ name: '명함/엽서/카드' });
    const poster = await repository.save({ name: '포스터' });
    const leaflet = await repository.save({ name: '리플렛' });
    const booklet = await repository.save({ name: '소책자/책' });

    // Children for 공통
    await repository.save({ name: '소량인쇄', parent: common });
    await repository.save({ name: '당일인쇄', parent: common });
    await repository.save({ name: '24시수령', parent: common });
    await repository.save({ name: '배송가능', parent: common });
    await repository.save({ name: '대형인쇄', parent: common });

    // Children for 명함/엽서/카드
    const quantityBC = await repository.save({
      name: '수량',
      parent: businessCard,
    });
    await repository.save({ name: '소량인쇄', parent: quantityBC });
    await repository.save({ name: '대량인쇄', parent: quantityBC });

    const postProcessingBC = await repository.save({
      name: '후가공',
      parent: businessCard,
    });
    const coatingBC = await repository.save({
      name: '코팅 / 부분코팅',
      parent: postProcessingBC,
    });
    await repository.save({ name: '무광/ 유광 코팅', parent: coatingBC });
    await repository.save({ name: '엠보코팅', parent: coatingBC });
    await repository.save({ name: 'CR코팅', parent: coatingBC });
    await repository.save({ name: '에폭시', parent: coatingBC });
    const cuttingLineBC = await repository.save({
      name: '재단선',
      parent: postProcessingBC,
    });
    await repository.save({ name: '오시 (접는 선)', parent: cuttingLineBC });
    await repository.save({ name: '미싱 (자르는 선)', parent: cuttingLineBC });
    const cornerRoundingBC = await repository.save({
      name: '코너 라운딩',
      parent: postProcessingBC,
    });
    await repository.save({ name: '귀돌이', parent: cornerRoundingBC });
    await repository.save({ name: '도무송', parent: cornerRoundingBC });
    await repository.save({ name: '접지', parent: postProcessingBC });
    await repository.save({ name: '타공', parent: postProcessingBC });
    await repository.save({ name: '박', parent: postProcessingBC });
    await repository.save({ name: '형압', parent: postProcessingBC });

    const printTypeBC = await repository.save({
      name: '인쇄 종류',
      parent: businessCard,
    });
    await repository.save({ name: '대형인쇄', parent: printTypeBC });
    await repository.save({ name: '리소인쇄', parent: printTypeBC });
    await repository.save({ name: '화이트인쇄', parent: printTypeBC });
    await repository.save({ name: '인디고인쇄', parent: printTypeBC });
    await repository.save({ name: '옵셋인쇄', parent: printTypeBC });
    await repository.save({ name: '레터프레스', parent: printTypeBC });

    // Children for 포스터
    const quantityPoster = await repository.save({
      name: '수량',
      parent: poster,
    });
    await repository.save({ name: '소량인쇄', parent: quantityPoster });
    await repository.save({ name: '대량인쇄', parent: quantityPoster });

    const postProcessingPoster = await repository.save({
      name: '후가공',
      parent: poster,
    });
    await repository.save({ name: '코팅', parent: postProcessingPoster });
    const partialCoatingPoster = await repository.save({
      name: '부분 코팅',
      parent: postProcessingPoster,
    });
    await repository.save({ name: '에폭시', parent: partialCoatingPoster });
    await repository.save({ name: '접지', parent: postProcessingPoster });
    await repository.save({ name: '타공', parent: postProcessingPoster });
    await repository.save({
      name: '오시 (접는 선)',
      parent: postProcessingPoster,
    });
    await repository.save({ name: '박', parent: postProcessingPoster });

    const printTypePoster = await repository.save({
      name: '인쇄 종류',
      parent: poster,
    });
    await repository.save({ name: '대형인쇄', parent: printTypePoster });
    await repository.save({ name: '리소인쇄', parent: printTypePoster });
    await repository.save({ name: '화이트인쇄', parent: printTypePoster });
    await repository.save({ name: '인디고인쇄', parent: printTypePoster });
    await repository.save({ name: '옵셋인쇄', parent: printTypePoster });
    await repository.save({ name: '레터프레스', parent: printTypePoster });

    // Children for 리플렛
    const quantityLeaflet = await repository.save({
      name: '수량',
      parent: leaflet,
    });
    await repository.save({ name: '소량인쇄', parent: quantityLeaflet });
    await repository.save({ name: '대량인쇄', parent: quantityLeaflet });

    const postProcessingLeaflet = await repository.save({
      name: '후가공',
      parent: leaflet,
    });
    await repository.save({ name: '코팅', parent: postProcessingLeaflet });
    const partialCoatingLeaflet = await repository.save({
      name: '부분 코팅',
      parent: postProcessingLeaflet,
    });
    await repository.save({ name: '에폭시', parent: partialCoatingLeaflet });
    await repository.save({ name: '접지', parent: postProcessingLeaflet });
    await repository.save({ name: '타공', parent: postProcessingLeaflet });
    await repository.save({
      name: '오시 (접는 선)',
      parent: postProcessingLeaflet,
    });
    await repository.save({ name: '박', parent: postProcessingLeaflet });
    await repository.save({
      name: '미싱 (자르는 선)',
      parent: postProcessingLeaflet,
    });

    const printTypeLeaflet = await repository.save({
      name: '인쇄 종류',
      parent: leaflet,
    });
    await repository.save({ name: '대형인쇄', parent: printTypeLeaflet });
    await repository.save({ name: '리소인쇄', parent: printTypeLeaflet });
    await repository.save({ name: '화이트인쇄', parent: printTypeLeaflet });
    await repository.save({ name: '인디고인쇄', parent: printTypeLeaflet });
    await repository.save({ name: '옵셋인쇄', parent: printTypeLeaflet });
    await repository.save({ name: '레터프레스', parent: printTypeLeaflet });

    // Children for 소책자/책
    const quantityBooklet = await repository.save({
      name: '수량',
      parent: booklet,
    });
    await repository.save({ name: '소량인쇄', parent: quantityBooklet });
    await repository.save({ name: '대량인쇄', parent: quantityBooklet });

    const postProcessingBooklet = await repository.save({
      name: '후가공',
      parent: booklet,
    });
    const binding = await repository.save({
      name: '제본',
      parent: postProcessingBooklet,
    });
    await repository.save({ name: '무선제본', parent: binding });
    await repository.save({ name: '중철제본', parent: binding });
    await repository.save({ name: '스프링제본', parent: binding });
    await repository.save({ name: '양장제본', parent: binding });
    await repository.save({ name: '실 제본', parent: binding });
    await repository.save({ name: '떡 제본', parent: binding });
    await repository.save({ name: '사철제본', parent: binding });

    const coverPostProcessingBooklet = await repository.save({
      name: '표지 후가공',
      parent: booklet,
    });
    await repository.save({ name: '박', parent: coverPostProcessingBooklet });
    await repository.save({ name: '코팅', parent: coverPostProcessingBooklet });
    const partialCoatingBooklet = await repository.save({
      name: '부분 코팅',
      parent: coverPostProcessingBooklet,
    });
    await repository.save({ name: '에폭시', parent: partialCoatingBooklet });
    await repository.save({ name: '형압', parent: coverPostProcessingBooklet });

    const printTypeBooklet = await repository.save({
      name: '인쇄 종류',
      parent: booklet,
    });
    await repository.save({ name: '옵셋인쇄', parent: printTypeBooklet });
    await repository.save({ name: '화이트 인쇄', parent: printTypeBooklet });
    await repository.save({ name: '인디고 인쇄', parent: printTypeBooklet });

    console.log('Tag seed data has been inserted');
  }
}
