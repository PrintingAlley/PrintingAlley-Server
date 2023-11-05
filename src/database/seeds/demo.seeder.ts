import { Category } from 'src/entity/category.entity';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Product } from 'src/entity/product.entity';
import { Tag } from 'src/entity/tag.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const categories = [
  {
    name: '포스터',
    image:
      'https://printingstreets.uk/6d23e574-d2a3-421a-ae08-0cbc8a7dc2f9_icon_poster.svg',
  },
  {
    name: '리플렛',
    image:
      'https://printingstreets.uk/398304ef-3b19-440a-a32a-25a12354d6e4_icon_leaflet.svg',
  },
  {
    name: '명함',
    image:
      'https://printingstreets.uk/cd2d4a68-c3a0-4266-9db7-cd5d7f8c1bcf_icon_businesscard.svg',
  },
  {
    name: '엽서/카드',
    image:
      'https://printingstreets.uk/2c4f62e3-21cd-4eba-8115-f014d5e3cca1_icon_postcard.svg',
  },
  {
    name: '소책자',
    image:
      'https://printingstreets.uk/53837729-0f91-4f83-b716-d9690a22e657_icon_pamphlet.svg',
  },
  {
    name: '책',
    image:
      'https://printingstreets.uk/ad493692-303f-44dc-b250-c42f417b9757_icon_book.svg',
  },
];

const printShops = [
  {
    name: '디자인점빵',
    address: '서울 중구 퇴계로 210-33',
    phone: '02-123-4567',
    email: 'oldpress@naver.com',
    homepage: 'https://www.instagram.com/oldpress',
    representative: '홍길동',
    introduction: '전통기법의 인쇄공방',
    logoImage:
      'https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/299584666_488084753320341_3428224445624543865_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bS-MyEwzDGUAX-uqEv2&_nc_ht=scontent-ssn1-1.xx&oh=00_AfDbgIytp1mCFBI0vZVMs4XX3ihA43BqACEdXjajKhZB3g&oe=65488A3E',
    backgroundImage:
      'https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/298834799_488084749987008_219361518583503773_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=TXtRex8X2dsAX_S2le9&_nc_ht=scontent-ssn1-1.xx&oh=00_AfAV_Ecg0mj_K1E_BPIcDH87_NUgIBh-pQxIv1v3LWMhBQ&oe=6549984D',
    latitude: '37.5607495419269',
    longitude: '126.995362279837',
  },
  {
    name: '밀리스트',
    address: '서울 성동구 성수동2가 299-104',
    phone: '02-123-4567',
    email: 'oldpress@naver.com',
    homepage: 'https://www.millist.co.kr/',
    representative: '정우진',
    introduction:
      '밀리스트는 오래된 인쇄방식인 레터프레스/활판인쇄로 청첩장, 엽서, 명함 등을 제작합니다',
    logoImage:
      'https://contents.sixshop.com/thumbnails/uploadedFiles/209565/default/image_1696921727277_500.jpg',
    backgroundImage:
      'https://contents.sixshop.com/thumbnails/uploadedFiles/209565/default/image_1696921624500_2500.jpg',
    latitude: '37.5495503467056',
    longitude: '127.053739188792',
  },
];

const runTagSeeder = async (dataSource: DataSource) => {
  const tagRepository = dataSource.getRepository(Tag);

  // Product categories
  const categories = [
    {
      name: '포스터',
      image:
        'https://printingstreets.uk/6d23e574-d2a3-421a-ae08-0cbc8a7dc2f9_icon_poster.svg',
    },
    {
      name: '리플렛',
      image:
        'https://printingstreets.uk/398304ef-3b19-440a-a32a-25a12354d6e4_icon_leaflet.svg',
    },
    {
      name: '명함',
      image:
        'https://printingstreets.uk/cd2d4a68-c3a0-4266-9db7-cd5d7f8c1bcf_icon_businesscard.svg',
    },
    {
      name: '엽서/카드',
      image:
        'https://printingstreets.uk/2c4f62e3-21cd-4eba-8115-f014d5e3cca1_icon_postcard.svg',
    },
    {
      name: '소책자',
      image:
        'https://printingstreets.uk/53837729-0f91-4f83-b716-d9690a22e657_icon_pamphlet.svg',
    },
    {
      name: '책',
      image:
        'https://printingstreets.uk/ad493692-303f-44dc-b250-c42f417b9757_icon_book.svg',
    },
  ];

  // For each category, create the tag and its children
  for (const categoryItem of categories) {
    const category = await tagRepository.save({
      name: categoryItem.name,
      image: categoryItem.image,
    });

    // Top-level tags
    const printType = await tagRepository.save({
      name: '인쇄종류',
      parent: category,
    });
    const postProcessing = await tagRepository.save({
      name: '후가공',
      parent: category,
    });

    // Children for 인쇄종류
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
    const coating = await tagRepository.save({
      name: '코팅',
      parent: postProcessing,
    });
    await tagRepository.save({ name: '무광/유광', parent: coating });

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

  // Returns all tags in the repository
  return tagRepository.find();
};

export default class DemoSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const categoryRepository = dataSource.getRepository(Category);
    const printShopRepository = dataSource.getRepository(PrintShop);
    const productRepository = dataSource.getRepository(Product);

    const createdCategories = await categoryRepository.save(categories);
    const createdTags = await runTagSeeder(dataSource);
    const createdPrintShops = await printShopRepository.save(printShops);

    const products = [
      {
        name: 'Dongseongro Blues Pub Branding',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/fd424fe4-f680-47ee-9be5-34b5b51680d4_7098d312b437617da3fcbfa83c6596d4.png',
        images: [
          'https://printingstreets.uk/f49f9221-39f6-45cd-8ec1-512004558f54_7098d312b437617da3fcbfa83c6596d4.png',
          'https://printingstreets.uk/f9dbf1f6-fc64-4bbc-92e6-4fa55af00f20_a65a33d7408971b2723e59f5eb4da8c8.png',
          'https://printingstreets.uk/28afe2c0-6042-429a-8289-423e4b4a7800_4c7fdc9ad4ec035f858a142d2177531e.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
      {
        name: 'NOMART NAMECARD',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/d96e7f3e-fcbb-4a7f-b73b-34b07386f0b6_2e191c747f2ed38cbed97ec189b82676.png',
        images: [
          'https://printingstreets.uk/5f908acc-3ea6-4242-9368-0a08fc214f40_01fd788a64f10b0b8e0bcbcbb316a95b.png',
          'https://printingstreets.uk/f4049ed7-97c0-4b2c-8214-923041d9115e_57a63cbb4b2434e7c82525485f669477.png',
          'https://printingstreets.uk/d96e7f3e-fcbb-4a7f-b73b-34b07386f0b6_2e191c747f2ed38cbed97ec189b82676.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
      {
        name: 'Graphics thisisgrey likes',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/f9dbf1f6-fc64-4bbc-92e6-4fa55af00f20_a65a33d7408971b2723e59f5eb4da8c8.png',
        images: [
          'https://printingstreets.uk/f49f9221-39f6-45cd-8ec1-512004558f54_7098d312b437617da3fcbfa83c6596d4.png',
          'https://printingstreets.uk/f9dbf1f6-fc64-4bbc-92e6-4fa55af00f20_a65a33d7408971b2723e59f5eb4da8c8.png',
          'https://printingstreets.uk/28afe2c0-6042-429a-8289-423e4b4a7800_4c7fdc9ad4ec035f858a142d2177531e.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
      {
        name: 'untitled studio',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/f4049ed7-97c0-4b2c-8214-923041d9115e_57a63cbb4b2434e7c82525485f669477.png',
        images: [
          'https://printingstreets.uk/5f908acc-3ea6-4242-9368-0a08fc214f40_01fd788a64f10b0b8e0bcbcbb316a95b.png',
          'https://printingstreets.uk/f4049ed7-97c0-4b2c-8214-923041d9115e_57a63cbb4b2434e7c82525485f669477.png',
          'https://printingstreets.uk/d96e7f3e-fcbb-4a7f-b73b-34b07386f0b6_2e191c747f2ed38cbed97ec189b82676.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
      {
        name: 'PAGE GALLERIES',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/28afe2c0-6042-429a-8289-423e4b4a7800_4c7fdc9ad4ec035f858a142d2177531e.png',
        images: [
          'https://printingstreets.uk/f49f9221-39f6-45cd-8ec1-512004558f54_7098d312b437617da3fcbfa83c6596d4.png',
          'https://printingstreets.uk/f9dbf1f6-fc64-4bbc-92e6-4fa55af00f20_a65a33d7408971b2723e59f5eb4da8c8.png',
          'https://printingstreets.uk/28afe2c0-6042-429a-8289-423e4b4a7800_4c7fdc9ad4ec035f858a142d2177531e.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
      {
        name: 'SPACELOGIC',
        size: '90*50mm',
        paper: '미색모조지 150g',
        afterProcess: '도무송',
        designer: '김종욱',
        introduction: '동성로 명함입니다.',
        description:
          '해상도\n해상도는 이미지의 PPI(인치당 픽셀 수)를 나타내며 명함 디자인의 품질에 중요한 역할을 합니다. 해상도가 높은 이미지는 더 선명하고 디테일한 인쇄물을 제공합니다. 일반적으로 인쇄용 이미지는 DPI(인치당 도트 수) 단위로 측정되며 명함 디자인에는 최소 300DPI가 권장됩니다.\n\n벡터 형식으로 디자인하기\n명함을 디자인할 때 벡터 그래픽은 많은 이점을 제공합니다. 픽셀로 구성되고 크기를 조정하면 품질이 저하될 수 있는 래스터 이미지와 달리 벡터 그래픽은 선명도를 잃지 않고 무한정 크기를 조정할 수 있는 수학적으로 정의된 선과 모양으로 구성됩니다. Adobe Illustrator의 AI 또는 EPS와 같은 벡터 형식은 디자인에 유연성과 정확성을 제공합니다.',
        mainImage:
          'https://printingstreets.uk/5f908acc-3ea6-4242-9368-0a08fc214f40_01fd788a64f10b0b8e0bcbcbb316a95b.png',
        images: [
          'https://printingstreets.uk/5f908acc-3ea6-4242-9368-0a08fc214f40_01fd788a64f10b0b8e0bcbcbb316a95b.png',
          'https://printingstreets.uk/f4049ed7-97c0-4b2c-8214-923041d9115e_57a63cbb4b2434e7c82525485f669477.png',
          'https://printingstreets.uk/d96e7f3e-fcbb-4a7f-b73b-34b07386f0b6_2e191c747f2ed38cbed97ec189b82676.png',
        ],
        category: createdCategories.find((category) => category.id === 3),
        printShop: createdPrintShops.find((shop) => shop.id === 1),
        tags: createdTags.filter((tag) => [73, 77, 78, 79].includes(tag.id)),
      },
    ];

    await productRepository.save(products);

    console.log('Demo seed data has been inserted');
  }
}
