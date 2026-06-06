import { useState } from 'react';
import styles from './TaskItem.module.css';

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, dragHandleProps }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editDue, setEditDue] = useState(task.dueDate?.slice(0, 10) || '');
  const [editError, setEditError] = useState('');

  const overdue = isOverdue(task.dueDate, task.completed);

  function handleSave() {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty');
      return;
    }
    onEdit(task.id, {
      title: editTitle,
      description: editDesc,
      dueDate: editDue || null,
    });
    setIsEditing(false);
    setEditError('');
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      onDelete(task.id);
    }
  }

  if (isEditing) {
    return (
      <div className={styles.card}>
        {editError && <p className={styles.error}>{editError}</p>}
        <input
          className={styles.editInput}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title *"
        />
        <textarea
          className={styles.editTextarea}
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description"
          rows={2}
        />
        <input
          className={styles.editInput}
          type="date"
          value={editDue}
          onChange={(e) => setEditDue(e.target.value)}
        />
        <div className={styles.editActions}>
          <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${overdue ? styles.overdue : ''} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.left}>
        {/* Drag Handle */}
        <span className={styles.dragHandle} {...dragHandleProps} title="Drag to reorder">
          ⠿
        </span>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
        />
        <div className={styles.content}>
          <p className={styles.title}>{task.title}</p>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}
          <div className={styles.meta}>
            {task.dueDate && (
              <span className={`${styles.due} ${overdue ? styles.overdueText : ''}`}>
                📅 {new Date(task.dueDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
                {overdue && ' — Overdue'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit</button>
        <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}