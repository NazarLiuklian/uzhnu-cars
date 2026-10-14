import styles from './StatBar.module.css'

export function StatBar({ label, count, height, color }) {
  return (
    <div className={styles.column}>
      <span className={styles.count}>{count}</span>
      <div
        className={styles.bar}
        style={{
          height: `${height}px`,
          backgroundColor: color || '#0ea5e9',
        }}
      />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
