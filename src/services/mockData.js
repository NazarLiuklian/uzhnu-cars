export const initialCars = [
  {
    id: 1,
    brand: 'BMW',
    model: '3 Series',
    year: 2019,
    faculty: 'Кафедра ІПЗ',
    owner: 'Бучук Р. Ю.',
    fuel: 'Бензин',
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
    imageText: '[ Фото Авто Nissan Leaf ]',
    favorite: false,
  },
]

export const statsData = {
  engineRatio: {
    electro: 30,
    ice: 70,
  },
  topBrands: [
    { brand: 'VW', count: 8, height: 110, color: '#0ea5e9' },
    { brand: 'Audi', count: 6, height: 80, color: '#38bdf8' },
    { brand: 'BMW', count: 4, height: 55, color: '#7dd3fc' },
    { brand: 'Skoda', count: 2, height: 25, color: '#bae6fd' },
  ],
  counters: {
    totalCars: 21,
    uniqueBrands: 15,
    averageYear: 2016,
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
