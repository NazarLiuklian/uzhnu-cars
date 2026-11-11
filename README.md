# uzhnu-cars

## Локальний запуск

В одному терміналі запустіть mock REST API:

```bash
npm run mock-api
```

В іншому терміналі запустіть React-застосунок:

```bash
npm run dev
```

API доступне за адресою `http://localhost:3001/cars` і підтримує GET, POST,
PATCH (обране) та DELETE. Дані зберігаються у [`db.json`](./db.json).

## Перевірка

```bash
npm test
```
