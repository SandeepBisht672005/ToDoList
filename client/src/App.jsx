import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';
import styles from './App.module.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError('Could not connect to server. Is it running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(taskData) {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch {
      setError('Failed to add task.');
    }
  }

  async function handleToggle(id, currentCompleted) {
    try {
      const updated = await updateTask(id, { completed: !currentCompleted });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError('Failed to update task.');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  }

  async function handleEdit(id, fields) {
    try {
      const updated = await updateTask(id, fields);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError('Failed to edit task.');
    }
  }

  // Drag and drop reorder — sirf UI mein, server pe persist nahi
  function handleReorder(reorderedTasks) {
    setTasks((prev) => {
      const reorderedIds = reorderedTasks.map((t) => t.id);
      const untouched = prev.filter((t) => !reorderedIds.includes(t.id));
      return [...reorderedTasks, ...untouched];
    });
  }

  const filtered = tasks
    .filter((t) => {
      if (filter === 'Active') return !t.completed;
      if (filter === 'Completed') return t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>✅ TaskFlow</h1>
        <p className={styles.subtitle}>Simple. Clean. Done.</p>
      </header>

      <main className={styles.main}>
        <TaskForm onAdd={handleAdd} />

        {error && (
          <div className={styles.errorBanner}>
            ⚠️ {error}
            <button className={styles.dismissBtn} onClick={() => setError('')}>✕</button>
          </div>
        )}

        <FilterBar
          active={filter}
          onFilter={setFilter}
          search={search}
          onSearch={setSearch}
          counts={counts}
        />

        {loading ? (
          <div className={styles.loading}>Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filtered}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReorder={handleReorder}
          />
        )}
      </main>
    </div>
  );
}