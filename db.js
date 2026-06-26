const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'database.sqlite'));
db.pragma('foreign_keys = ON');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      site TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL DEFAULT 0,
      category_id INTEGER NOT NULL,
      provider_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
      FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, course_id),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );
  `);

  const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
  if (categoryCount === 0) {
    db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)')
      .run('Агрономия', 'Курсы по растениеводству и почвоведению');
    db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)')
      .run('Агробизнес', 'Курсы по управлению и экономике АПК');
  }

  const providerCount = db.prepare('SELECT COUNT(*) AS count FROM providers').get().count;
  if (providerCount === 0) {
    db.prepare('INSERT INTO providers (name, site) VALUES (?, ?)')
      .run('AgroAcademy', 'https://example.com/agro');
    db.prepare('INSERT INTO providers (name, site) VALUES (?, ?)')
      .run('FarmEdu', 'https://example.com/farmedu');
  }

  const courseCount = db.prepare('SELECT COUNT(*) AS count FROM courses').get().count;
  if (courseCount === 0) {
    db.prepare('INSERT INTO courses (title, description, price, category_id, provider_id) VALUES (?, ?, ?, ?, ?)')
      .run('Основы агрономии', 'Базовый курс по агрономии', 4900, 1, 1);
    db.prepare('INSERT INTO courses (title, description, price, category_id, provider_id) VALUES (?, ?, ?, ?, ?)')
      .run('Управление агробизнесом', 'Курс по экономике и управлению АПК', 7900, 2, 2);
  }

  const studentCount = db.prepare('SELECT COUNT(*) AS count FROM students').get().count;
  if (studentCount === 0) {
    db.prepare('INSERT INTO students (full_name, email) VALUES (?, ?)')
      .run('Сычев Даниил', 'sychev@example.com');
  }
}

module.exports = { db, initDatabase };
