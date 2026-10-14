import styles from './SidebarFilter.module.css'

export function SidebarFilter({
  isAuth,
  selectedDepartment,
  onSelectDepartment,
  selectedFuel,
  onSelectFuel,
  onlyFavorites,
  onToggleFavorites,
  onReset,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerRow}>
        <span className={styles.badge}>Фільтри</span>
        {isAuth && (
          <button type="button" onClick={onReset} className={styles.resetButton}>
            Скинути
          </button>
        )}
      </div>

      {isAuth && (
        <div className={styles.favoritesBox}>
          <span className={styles.favoritesLabel}>Тільки мої обрані</span>
          <input
            type="checkbox"
            checked={onlyFavorites}
            onChange={(e) => onToggleFavorites(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
      )}

      <div className={styles.group}>
        <label className={styles.label}>Підрозділ / Кафедра</label>
        <div className={styles.deptList}>
          <button
            type="button"
            onClick={() =>
              onSelectDepartment(selectedDepartment === 'Кафедра ІПЗ' ? '' : 'Кафедра ІПЗ')
            }
            className={`${styles.deptItem} ${
              selectedDepartment === 'Кафедра ІПЗ' ? styles.deptItemActive : ''
            }`}
          >
            Кафедра ІПЗ
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectDepartment(selectedDepartment === 'Кафедра ІСТ' ? '' : 'Кафедра ІСТ')
            }
            className={`${styles.deptItem} ${
              selectedDepartment === 'Кафедра ІСТ' ? styles.deptItemActive : ''
            }`}
          >
            Кафедра ІСТ
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Тип палива</label>
        <div className={styles.fuelList}>
          <button
            type="button"
            onClick={() => onSelectFuel(selectedFuel === 'Електро' ? '' : 'Електро')}
            className={`${styles.fuelPill} ${
              selectedFuel === 'Електро' ? styles.fuelPillActive : ''
            }`}
          >
            Електро
          </button>
          <button
            type="button"
            onClick={() => onSelectFuel(selectedFuel === 'Бензин' ? '' : 'Бензин')}
            className={`${styles.fuelPill} ${
              selectedFuel === 'Бензин' ? styles.fuelPillActive : ''
            }`}
          >
            Бензин
          </button>
          <button
            type="button"
            onClick={() => onSelectFuel(selectedFuel === 'Дизель' ? '' : 'Дизель')}
            className={`${styles.fuelPill} ${
              selectedFuel === 'Дизель' ? styles.fuelPillActive : ''
            }`}
          >
            Дизель
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Рік випуску</label>
        <div className={styles.yearRow}>
          <input type="text" value="2000" className={styles.yearInput} readOnly />
          <span className={styles.yearSeparator}>-</span>
          <input type="text" value="2026" className={styles.yearInput} readOnly />
        </div>
      </div>
    </aside>
  )
}
