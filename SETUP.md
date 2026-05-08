# Prisma 7 Setup Guide — NestJS + PostgreSQL

## 1. Установка зависимостей

```bash
npm i prisma @prisma/client @prisma/adapter-pg pg
```

---

## 2. Инициализация Prisma

```bash
npx prisma init
```

Создаст:
- `prisma/schema.prisma` — схема моделей
- `prisma.config.ts` — конфигурация для CLI
- `.env` — переменные окружения

---

## 3. Настройка docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:15
    container_name: nest_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: products_db
    ports:
      - '5433:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

---

## 4. Настройка .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/products_db"
```

---

## 5. Настройка prisma.config.ts

```typescript
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
```

---

## 6. Описание моделей в schema.prisma

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}

model Product {
  id          Int     @id @default(autoincrement())
  name        String
  price       Float
  description String?
}
```

**Важно:**
- `moduleFormat = "cjs"` — обязательно для NestJS (CommonJS)
- `output` — папка где будет сгенерирован клиент

---

## 7. Генерация и применение миграций

```bash
# Создать и применить миграцию (generate запускается автоматически)
npx prisma migrate dev --name init

# Только сгенерировать клиент (без миграции)
npx prisma generate
```

---

## 8. Создание PrismaService

```bash
nest g module prisma
nest g service prisma
```

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Важно — Prisma 7:**
- Нужен `@prisma/adapter-pg` — прямое подключение через адаптер
- `PrismaPg` принимает `connectionString` из `.env`
- Адаптер передаётся в `super({ adapter })`

---

## 9. Регистрация PrismaModule

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 10. Использование в сервисе

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
```

---

## Порядок действий (Workflow)

### Новый проект:
```bash
npm i prisma @prisma/client @prisma/adapter-pg pg
npx prisma init
# настроить .env, docker-compose, schema.prisma
docker-compose up -d
npx prisma migrate dev --name init
```

### Изменил модель:
```bash
# 1. Изменить schema.prisma
# 2. Применить
npx prisma migrate dev --name add_description
```

### Склонировал проект:
```bash
npm install
docker-compose up -d
npx prisma migrate deploy
npx prisma generate
```

---

## Полезные команды

```bash
npx prisma migrate dev --name <название>   # создать и применить миграцию
npx prisma migrate deploy                  # продакшн — применить миграции
npx prisma migrate reset                   # сбросить всё (только dev!)
npx prisma generate                        # обновить клиент без миграции
npx prisma studio                          # GUI для просмотра данных в БД
npx prisma db push                         # применить схему без миграции (только dev)
```

---

## Синтаксис моделей

### Типы данных:
```prisma
Int       → целое число
Float     → число с плавающей точкой
String    → строка
Boolean   → булево
DateTime  → дата и время
Json      → JSON объект
```

### Декораторы полей:
```prisma
@id                    → первичный ключ
@default(autoincrement()) → автоинкремент
@default(now())        → текущая дата
@updatedAt             → автообновление при изменении
@unique                → уникальное поле
?                      → nullable (опциональное)
```

### Enum:
```prisma
enum Role {
  STUDENT
  TEACHER
  ADMIN
}
```

### Relations:
```prisma
// OneToMany
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id     Int  @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id])
}
```

### Основные методы запросов:
```typescript
prisma.product.findMany()                          // все записи
prisma.product.findUnique({ where: { id } })       // по уникальному полю
prisma.product.findFirst({ where: { name } })      // первая по условию
prisma.product.create({ data: dto })               // создать
prisma.product.update({ where: { id }, data: dto }) // обновить
prisma.product.delete({ where: { id } })           // удалить
prisma.product.count({ where: {} })                // посчитать
```

### Транзакции:
```typescript
// Массив операций
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.profile.create({ data: profileData }),
])

// Интерактивная транзакция
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData })
  await tx.profile.create({ data: { ...profileData, userId: user.id } })
})
```

prisma migrate dev — для разработки:

Создаёт файл миграции
Применяет его к базе
Регенерирует Prisma клиент

prisma migrate deploy — для production:

Только применяет существующие миграции
Не создаёт новых
Не трогает клиент

prisma migrate reset — сброс:

Удаляет все данные
Применяет все миграции с нуля
Только для разработки!

prisma db push — быстрый проброс схемы:

Не создаёт файл миграции
Просто синхронизирует схему с базой
Для прототипирования

prisma generate — только регенерирует клиент без миграций