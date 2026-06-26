const express = require('express');
const { db, initDatabase } = require('./db');
const { createCrudRouter } = require('./crudRouter');

initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Лабораторная работа 3. CRUD API для БД онлайн-курсов по агрономии и агробизнесу',
    routes: [
      '/categories',
      '/providers',
      '/courses',
      '/students',
      '/enrollments',
      '/courses-full',
      '/students-full/:id'
    ]
  });
});

app.use('/categories', createCrudRouter(db, 'categories', ['name', 'description']));
app.use('/providers', createCrudRouter(db, 'providers', ['name', 'site']));
app.use('/courses', createCrudRouter(db, 'courses', ['title', 'description', 'price', 'category_id', 'provider_id']));
app.use('/students', createCrudRouter(db, 'students', ['full_name', 'email']));
app.use('/enrollments', createCrudRouter(db, 'enrollments', ['student_id', 'course_id']));

app.get('/courses-full', (req, res) => {
  const rows = db.prepare(`
    SELECT
      courses.id,
      courses.title,
      courses.description,
      courses.price,
      categories.name AS category,
      providers.name AS provider
    FROM courses
    JOIN categories ON courses.category_id = categories.id
    JOIN providers ON courses.provider_id = providers.id
  `).all();
  res.json(rows);
});

app.get('/students-full/:id', (req, res) => {
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
  if (!student) return res.status(404).json({ error: 'Студент не найден' });

  const courses = db.prepare(`
    SELECT courses.*
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.student_id = ?
  `).all(req.params.id);

  res.json({ ...student, courses });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
