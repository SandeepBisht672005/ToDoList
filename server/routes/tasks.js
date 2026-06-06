const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

const router = express.Router();

// GET /api/tasks - get all tasks
router.get('/', (req, res) => {
  const tasks = store.getAll();
  res.json(tasks);
});

// GET /api/tasks/:id - get single task
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /api/tasks - create task
router.post('/', (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || '',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  store.create(task);
  res.status(201).json(task);
});

// PATCH /api/tasks/:id - update task
router.patch('/:id', (req, res) => {
  const { title, description, dueDate, completed } = req.body;

  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  const updated = store.update(req.params.id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(dueDate !== undefined && { dueDate }),
    ...(completed !== undefined && { completed }),
  });

  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// DELETE /api/tasks/:id - delete task
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;