export const initialCars = [
  {
    id: 1,
    brand: 'BMW',
    model: '3 Series',
    year: 2019,
    faculty: 'Кафедра ІПЗ',
    owner: 'Бучук Р. Ю.',
    fuel: 'Бензин',
    imageUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg/1280px-2019_BMW_318d_SE_Automatic_2.0_Front.jpg',
    imageText: '[ Фото Авто BMW ]',
    favorite: false,
  },
  {
    id: 2,
    brand: 'Audi',
    model: 'A6',
    year: 2018,
    faculty: 'Кафедра ІСТ',
    owner: 'Білак Ю. Ю.',
    fuel: 'Дизель',
    imageUrl:
      'https://media.ed.edmunds-media.com/audi/a6/2018/oem/2018_audi_a6_sedan_30-tfsi-prestige-quattro_fq_oem_2_1600.jpg',
    imageText: '[ Фото Авто Audi ]',
    favorite: true,
  },
  {
    id: 3,
    brand: 'Volkswagen',
    model: 'Passat B8',
    year: 2017,
    faculty: 'Кафедра ІПЗ',
    owner: 'Сегін І. М.',
    fuel: 'Дизель',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/91/VW_Passat_B8_Limousine_2.0_TDI_Highline.JPG',
    imageText: '[ Фото Авто VW ]',
    favorite: false,
  },
  {
    id: 4,
    brand: 'Nissan',
    model: 'Leaf',
    year: 2021,
    faculty: 'Кафедра ІПЗ',
    owner: 'Мельник О. О.',
    fuel: 'Електро',
    imageUrl:
      'https://wieck-nissanao-production.s3.us-west-1.amazonaws.com/releaseInlineImages/67c8675762e75f9327220cb00aba8abd59fc9db3',
    imageText: '[ Фото Авто Nissan Leaf ]',
    favorite: false,
  },
]

export const statsData = {
  engineRatio: {
    electro: 25,
    ice: 75,
  },
  topBrands: [
    { brand: 'BMW', count: 1, height: 110, color: '#0ea5e9' },
    { brand: 'Audi', count: 1, height: 110, color: '#38bdf8' },
    { brand: 'Volkswagen', count: 1, height: 110, color: '#7dd3fc' },
    { brand: 'Nissan', count: 1, height: 110, color: '#bae6fd' },
  ],
  counters: {
    totalCars: 4,
    uniqueBrands: 4,
    averageYear: 2019,
  },
}

export const initialSubmissions = [
  {
    id: 1,
    title: 'Skoda Fabia (2015, 1.4 TDI)',
    subtitle: 'Викладач: Семків О. М. • Кафедра ІСТ • Надіслано сьогодні',
    status: 'pending',
    statusLabel: 'На модерації ⏳',
  },
  {
    id: 2,
    title: 'BMW 3 Series (2019, 2.0 Petrol)',
    subtitle: 'Викладач: Бучук Р. Ю. • Кафедра ІПЗ • Опубліковано в каталозі',
    status: 'approved',
    statusLabel: 'Опубліковано ✅',
  },
]
