const express = require('express');

function createCrudRouter(db, tableName, fields) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    res.json(rows);
  });

  router.get('/:id', (req, res) => {
    const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Запись не найдена' });
    res.json(row);
  });

  router.post('/', (req, res) => {
    try {
      const values = fields.map((field) => req.body[field]);
      const columns = fields.join(', ');
      const placeholders = fields.map(() => '?').join(', ');
      const result = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`).run(values);
      const created = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(result.lastInsertRowid);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put('/:id', (req, res) => {
    try {
      const exists = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      if (!exists) return res.status(404).json({ error: 'Запись не найдена' });

      const values = fields.map((field) => req.body[field]);
      const setClause = fields.map((field) => `${field} = ?`).join(', ');
      db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`).run([...values, req.params.id]);
      const updated = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.patch('/:id', (req, res) => {
    try {
      const exists = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      if (!exists) return res.status(404).json({ error: 'Запись не найдена' });

      const changedFields = fields.filter((field) => Object.prototype.hasOwnProperty.call(req.body, field));
      if (changedFields.length === 0) return res.status(400).json({ error: 'Нет полей для обновления' });

      const values = changedFields.map((field) => req.body[field]);
      const setClause = changedFields.map((field) => `${field} = ?`).join(', ');
      db.prepare(`UPDATE ${tableName} SET ${setClause} WHERE id = ?`).run([...values, req.params.id]);
      const updated = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', (req, res) => {
    try {
      const result = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Запись не найдена' });
      res.json({ message: 'Запись удалена' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}

module.exports = { createCrudRouter };
