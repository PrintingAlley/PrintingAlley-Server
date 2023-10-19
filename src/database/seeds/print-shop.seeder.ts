import { PrintShop } from 'src/entity/print-shop.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class PrintShopSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const printShopRepository = dataSource.getRepository(PrintShop);

    const names = [
      '한국인쇄',
      '프린트킹',
      '빠른인쇄',
      '프린트월드',
      '인쇄마스터',
      '인쇄마루',
      '인쇄나라',
      '인쇄나무',
      '프린트스튜디오',
      '디지털인쇄소',
      '프린트팩토리',
      '빠른프린트',
      '인쇄하우스',
      '프린트허브',
      '인쇄프로',
      '인쇄스토어',
      '프린트샵24',
      '인쇄연구소',
      '프린트랩',
      '인쇄코리아',
    ];
    const addresses = [
      '서울시 중구 서소문로 123번길 45, 대영빌딩 1층',
      '부산시 해운대구 해운대로 456번길 78, 해바라기빌딩 2층',
      '대전시 대덕구 신대로 789번길 12, 한화타워 3층',
      '인천시 부평구 중로 101번길 23, 인천빌딩 B동 4층',
      '광주시 서구 첨단로 234번길 56, 광주타워 A동 5층',
      '대구시 중구 동성로 345번길 67, 대구빌딩 6층',
      '울산시 남구 중앙로 567번길 89, 울산빌딩 7층',
      '제주시 연동 중앙로 678번길 90, 제주빌딩 8층',
      '수원시 팔달구 인계로 789번길 01, 수원타워 B동 9층',
      '고양시 일산동구 중앙로 890번길 12, 일산빌딩 C동 10층',
      '성남시 분당구 성남대로 901번길 34, 분당빌딩 D동 11층',
      '안양시 만안구 안양로 012번길 56, 안양타워 E동 12층',
      '창원시 마산회원구 3·15대로 123번길 78, 창원빌딩 F동 13층',
      '천안시 동남구 동서대로 234번길 90, 천안빌딩 G동 14층',
      '포항시 북구 삼흥로 345번길 01, 포항타워 H동 15층',
      '제주시 이도2동 천수로 456번길 23, 이도빌딩 I동 16층',
      '남양주시 화도읍 능내로 567번길 45, 남양주빌딩 J동 17층',
      '청주시 상당구 중앙로 678번길 67, 청주타워 K동 18층',
      '안산시 상록구 충장로 789번길 89, 안산빌딩 L동 19층',
      '전주시 완산구 고사동 890번길 12, 전주빌딩 M동 20층',
    ];
    const images = [
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999453375F9A167019',
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F995FD04B5F9A16701D',
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99DD054C5F9A16701C',
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F9926F9445F9A16701B',
    ];

    const getRandomElement = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    const printShops = Array(100)
      .fill(0)
      .map((_, index) => {
        return {
          name: `${getRandomElement(names)}-${index + 1}`,
          address: getRandomElement(addresses),
          phone: '02-732-7000',
          email: 'print@gmail.com',
          homepage: 'https://www.publishersglobal.com',
          representative: '홍길동',
          introduction: 'Composed of some 1,000 Korean Printings as members.',
          logoImage: getRandomElement(images),
          backgroundImage: getRandomElement(images),
          latitude: '37.5665',
          longitude: '126.9780',
        };
      });

    await printShopRepository.save(printShops);

    console.log('PrintShop seed data has been inserted');
  }
}
