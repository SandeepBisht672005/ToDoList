import { useState } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onAdd({ title, description, dueDate: dueDate || null });
    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Add New Task</h2>

      {error && <p className={styles.error}>{error}</p>}

      <input
        className={styles.input}
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className={styles.textarea}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <input
        className={styles.input}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button className={styles.button} type="submit">
        Add Task
      </button>
    </form>
  );
}