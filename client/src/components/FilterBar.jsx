import styles from './FilterBar.module.css';

const FILTERS = ['All', 'Active', 'Completed'];

export default function FilterBar({ active, onFilter, search, onSearch, counts }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${active === f ? styles.activeFilter : ''}`}
              onClick={() => onFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.counts}>
          <span className={styles.countBadge}>✅ {counts.completed} done</span>
          <span className={styles.countBadge}>🔵 {counts.active} active</span>
        </div>
      </div>
      <input
        className={styles.search}
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}