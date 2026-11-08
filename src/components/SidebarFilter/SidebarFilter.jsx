import styles from './SidebarFilter.module.css'

export function SidebarFilter({
  isAuth,
  selectedDepartment,
  onSelectDepartment,
  selectedFuel,
  onSelectFuel,
  minYear = '',
  onMinYearChange,
  maxYear = '',
  onMaxYearChange,
  onlyFavorites,
  onToggleFavorites,
  onReset,
}) {
  const fuelOptions = ['Дизель', 'Бензин', 'Електро', 'Гібрид']

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerRow}>
        <span className={styles.badge}>Фільтри</span>
        <button type="button" onClick={onReset} className={styles.resetButton}>
          Скинути
        </button>
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
          {fuelOptions.map((fuel) => (
            <button
              key={fuel}
              type="button"
              onClick={() => onSelectFuel(selectedFuel === fuel ? '' : fuel)}
              className={`${styles.fuelPill} ${selectedFuel === fuel ? styles.fuelPillActive : ''}`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Рік випуску</label>
        <div className={styles.yearRow}>
          <input
            type="number"
            min="1990"
            max="2026"
            placeholder="Від"
            value={minYear}
            onChange={(e) => onMinYearChange && onMinYearChange(e.target.value)}
            className={styles.yearInput}
          />
          <span className={styles.yearSeparator}>-</span>
          <input
            type="number"
            min="1990"
            max="2026"
            placeholder="До"
            value={maxYear}
            onChange={(e) => onMaxYearChange && onMaxYearChange(e.target.value)}
            className={styles.yearInput}
          />
        </div>
      </div>
    </aside>
  )
}
