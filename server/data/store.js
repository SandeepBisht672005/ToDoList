const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'tasks.db'));

// Table banao agar exist nahi karta
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    dueDate TEXT,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

function getAll() {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all();
  return rows.map(normalize);
}

function getById(id) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return row ? normalize(row) : null;
}

function create(task) {
  db.prepare(`
    INSERT INTO tasks (id, title, description, dueDate, completed, createdAt)
    VALUES (@id, @title, @description, @dueDate, @completed, @createdAt)
  `).run({ ...task, completed: task.completed ? 1 : 0 });
}

function update(id, fields) {
  const task = getById(id);
  if (!task) return null;

  const updated = { ...task, ...fields };
  db.prepare(`
    UPDATE tasks SET
      title = @title,
      description = @description,
      dueDate = @dueDate,
      completed = @completed
    WHERE id = @id
  `).run({ ...updated, completed: updated.completed ? 1 : 0 });

  return getById(id);
}

function remove(id) {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

// SQLite 0/1 ko boolean mein convert karo
function normalize(row) {
  return { ...row, completed: row.completed === 1 };
}

module.exports = { getAll, getById, create, update, remove };