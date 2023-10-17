import { PrintShop } from 'src/entity/print-shop.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class PrintShopSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const printShopRepository = dataSource.getRepository(PrintShop);

    // Sample data for 4 PrintShops
    const printShops = [
      {
        name: '한국인쇄협회',
        address: '서울시 중구 서소문로 75, 3층 (서소문동, 한국인쇄협회)',
        phone: '02-732-7000',
        email: 'print@gmail.com',
        homepage: 'https://www.publishersglobal.com',
        representative: '홍길동',
        introduction:
          'Composed of some 1,000 Korean Printings as members. They jointly participate in exhibitions to introduce the printing of Korea and consult the export of printed matters.',
        logoImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999453375F9A167019',
        backgroundImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999453375F9A167019',
        latitude: '37.5665',
        longitude: '126.9780',
      },
      {
        name: '헤이델프린트',
        address:
          '경기도 성남시 분당구 대왕판교로 644번길 49 (삼평동, 헤이델프린트)',
        phone: '031-789-1000',
        email: 'print@gmail.com',
        homepage: 'https://www.publishersglobal.com',
        representative: '홍길동',
        introduction:
          'Heidel Print offers quality prints and papers at affordable pricing. Instant Quotes available on their site and they offer excellent customer services.',
        logoImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F995FD04B5F9A16701D',
        backgroundImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F995FD04B5F9A16701D',
        latitude: '37.3605',
        longitude: '127.1054',
      },
      {
        name: '인쇄협동조합',
        address: '서울시 은평구 진흥로 111, 3층 (진관동, 인쇄협동조합)',
        phone: '02-732-7000',
        email: 'print@gmail.com',
        homepage: 'https://www.publishersglobal.com',
        representative: '홍길동',
        introduction: 'Composed of some 1,000 Korean printers as members.',
        logoImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99DD054C5F9A16701C',
        backgroundImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99DD054C5F9A16701C',
        latitude: '37.5665',
        longitude: '126.9780',
      },
      {
        name: '팩컴코리아 성온인쇄(주)',
        address: '경기도 군포시 산본로 229 (산본동, 팩컴코리아 성온인쇄(주)',
        phone: '031-390-5000',
        email: 'print@gmail.com',
        homepage: 'https://www.publishersglobal.com',
        representative: '홍길동',
        introduction:
          'The largest and most technologically advanced illustrated book export manufacturer in South Korea. Specializes in full-color titles including book-plus, art photography books, large coffee table books, magazines, calendars, etc.',
        logoImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F9926F9445F9A16701B',
        backgroundImage:
          'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F9926F9445F9A16701B',
        latitude: '37.3626',
        longitude: '126.9340',
      },
    ];

    await printShopRepository.save(printShops);

    console.log('PrintShop seed data has been inserted');
  }
}
