# User Management Service

Сервис управления пользователями на Express + TypeScript.

## Технологии

- Express + TypeScript
- PostgreSQL + TypeORM
- JWT авторизация
- bcrypt для хеширования паролей

## Быстрый старт

# Установка зависимостей
npm install

# Запуск PostgreSQL (требуется Docker)
docker-compose up -d

# Запуск сервера
npm run dev
Сервер запускается на http://localhost:3000

API Endpoints

Метод	Эндпоинт	Описание	Доступ
POST	/api/register	Регистрация	Публичный
POST	/api/login	Вход	Публичный
GET	/api/users/:id	Получить пользователя	Админ или владелец
GET	/api/users	Список пользователей	Только админ
PATCH	/api/users/:id/block	Блокировка/разблокировка	Админ или владелец
Примеры запросов

Регистрация

bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Иванов",
    "birthDate": "1990-01-15",
    "email": "ivan@example.com",
    "password": "password123"
  }'
Вход

bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "password123"
  }'
Получение пользователя

bash
curl -X GET http://localhost:3000/api/users/{id} \
  -H "Authorization: Bearer {token}"
Список пользователей (админ)

bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer {token}"
Блокировка

bash
curl -X PATCH http://localhost:3000/api/users/{id}/block \
  -H "Authorization: Bearer {token}"
Переменные окружения

Создайте файл .env на основе .env.example:

Переменная	Значение по умолчанию
PORT	3000
DB_HOST	localhost
DB_PORT	5432
DB_USERNAME	postgres
DB_PASSWORD	postgres
DB_NAME	user_service
JWT_SECRET	(обязательно измените)
JWT_EXPIRES_IN	24h
