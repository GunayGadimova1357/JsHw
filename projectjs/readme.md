# Pulse News

Современное веб‑приложение для просмотра актуальных новостей по категориям с пагинацией.

## Что умеет

- Загружает новости через `NewsAPI` (категории: Technology, Business, Sports)
- Показывает карточки с изображением, заголовком, описанием и датой публикации
- Поддерживает пагинацию (`Prev` / `Next`)
- Показывает понятные статусы загрузки и ошибки
- Адаптивный интерфейс для desktop и mobile

## Технологии

- Backend: `Node.js` + `Express` + `TypeScript`
- Frontend: `HTML` + `CSS` + `TypeScript/JavaScript`
- API: [NewsAPI](https://newsapi.org)

## Требования

- `Node.js` 18+
- `npm`
- API-ключ от NewsAPI

## Установка

```bash
npm install
```

## Настройка переменных окружения

Создай файл `.env` в корне проекта:

```env
NEWS_API_KEY=your_newsapi_key_here
```

Где взять ключ:
1. Зарегистрируйся на https://newsapi.org
2. Скопируй API key из личного кабинета
3. Вставь в `.env`

## Запуск проекта

### Режим разработки

```bash
npm run dev
```

Сервер стартует на:

- `http://localhost:3000`

### Продакшн-режим

1. Сборка:

```bash
npm run build
```

2. Запуск собранной версии:

```bash
npm start
```

## Скрипты

- `npm run dev` — запуск сервера из `src` через `ts-node`
- `npm run build` — компиляция TypeScript в папку `dist`
- `npm start` — запуск сервера из `dist/server.js`

## Структура проекта

```text
src/
  public/
    index.html      # UI
    styles.css      # стили
    main.ts         # клиентская логика
    main.js         # клиентский скрипт, подключаемый в браузере
  server.ts         # backend и прокси к NewsAPI
dist/
  ...               # собранные файлы после npm run build
```

## Частые проблемы

### 1) На странице нет новостей

Проверь:

- запущен ли сервер (`npm run dev`)
- правильный ли ключ в `.env`
- не превышен ли лимит запросов NewsAPI

### 2) Ошибка `NEWS_API_KEY is missing in .env`

Добавь `NEWS_API_KEY` в `.env` и перезапусти сервер.

### 3) Изменения не видны в `npm start`

Сначала пересобери проект:

```bash
npm run build
```

Потом запускай:

```bash
npm start
```

## Планы по улучшению

- Поиск новостей по ключевым словам
- Больше категорий
- Кеширование запросов на сервере
- Тёмная/светлая темы
