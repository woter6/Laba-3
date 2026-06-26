# Лабораторная работа 3 — CRUD API

## Тема базы данных
Агрегатор онлайн-курсов по агрономии и агробизнесу.

## Что реализовано
Проект реализует REST API с CRUD-операциями: создание, чтение, обновление и удаление записей.

## Таблицы базы данных
1. `categories` — категории курсов.
2. `providers` — платформы/поставщики курсов.
3. `courses` — курсы.
4. `students` — студенты/пользователи.
5. `enrollments` — записи студентов на курсы.

## Связи между таблицами
- `categories` → `courses`: связь **один ко многим**. Одна категория может содержать много курсов.
- `providers` → `courses`: связь **один ко многим**. Один поставщик может иметь много курсов.
- `students` ↔ `courses`: связь **многие ко многим** через таблицу `enrollments`. Один студент может записаться на много курсов, и на один курс может записаться много студентов.

## Запуск проекта

```bash
npm install
npm start
```

После запуска сервер будет доступен по адресу:

```text
http://localhost:3000
```

## Основные маршруты API

### Categories
- `GET /categories` — получить все категории.
- `GET /categories/:id` — получить категорию по id.
- `POST /categories` — создать категорию.
- `PUT /categories/:id` — полностью обновить категорию.
- `PATCH /categories/:id` — частично обновить категорию.
- `DELETE /categories/:id` — удалить категорию.

Пример POST:

```json
{
  "name": "Почвоведение",
  "description": "Курсы по анализу и улучшению почвы"
}
```

### Providers
- `GET /providers`
- `GET /providers/:id`
- `POST /providers`
- `PUT /providers/:id`
- `PATCH /providers/:id`
- `DELETE /providers/:id`

Пример POST:

```json
{
  "name": "AgroPro",
  "site": "https://example.com/agropro"
}
```

### Courses
- `GET /courses`
- `GET /courses/:id`
- `POST /courses`
- `PUT /courses/:id`
- `PATCH /courses/:id`
- `DELETE /courses/:id`

Пример POST:

```json
{
  "title": "Точное земледелие",
  "description": "Курс по цифровым технологиям в сельском хозяйстве",
  "price": 9900,
  "category_id": 1,
  "provider_id": 1
}
```

### Students
- `GET /students`
- `GET /students/:id`
- `POST /students`
- `PUT /students/:id`
- `PATCH /students/:id`
- `DELETE /students/:id`

Пример POST:

```json
{
  "full_name": "Иван Иванов",
  "email": "ivan@example.com"
}
```

### Enrollments
- `GET /enrollments`
- `GET /enrollments/:id`
- `POST /enrollments`
- `PUT /enrollments/:id`
- `PATCH /enrollments/:id`
- `DELETE /enrollments/:id`

Пример POST:

```json
{
  "student_id": 1,
  "course_id": 1
}
```

## Дополнительные маршруты
- `GET /courses-full` — получить курсы вместе с категорией и поставщиком.
- `GET /students-full/:id` — получить студента и список его курсов.

## Как загрузить на GitHub

1. Создай новый репозиторий на GitHub.
2. Открой папку проекта в терминале.
3. Выполни команды:

```bash
git init
git add .
git commit -m "Лабораторная работа 3 CRUD API"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/НАЗВАНИЕ_РЕПОЗИТОРИЯ.git
git push -u origin main
```

Перед этим желательно создать файл `.gitignore`, чтобы не загружать `node_modules` и базу SQLite.
