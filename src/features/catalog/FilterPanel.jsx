export function FilterPanel({ filters, onChange, onReset }) {
  const toggle = (key, value) => {
    const values = filters[key].includes(value)
    onChange({
      ...filters,
      [key]: values ? filters[key].filter((item) => item !== value) : [...filters[key], value],
    })
  }

  return (
    <aside className="filters">
      <div className="section-heading">
        <span className="eyebrow">Налаштування</span>
        <h2>Фільтри</h2>
      </div>
      <fieldset>
        <legend>Кафедра</legend>
        {['ІПЗ', 'ІСТ'].map((item) => (
          <label className="check-row" key={item}>
            <input
              type="checkbox"
              checked={filters.department.includes(item)}
              onChange={() => toggle('department', item)}
            />
            {item}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Тип палива</legend>
        {['Електро', 'Бензин', 'Дизель'].map((item) => (
          <label className="check-row" key={item}>
            <input
              type="checkbox"
              checked={filters.fuel.includes(item)}
              onChange={() => toggle('fuel', item)}
            />
            {item}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Рік випуску</legend>
        <div className="range-values">
          <span>{filters.year[0]}</span>
          <span>{filters.year[1]}</span>
        </div>
        <input
          className="range"
          type="range"
          min="2000"
          max="2026"
          value={filters.year[0]}
          onChange={(event) =>
            onChange({ ...filters, year: [Number(event.target.value), filters.year[1]] })
          }
        />
        <input
          className="range"
          type="range"
          min="2000"
          max="2026"
          value={filters.year[1]}
          onChange={(event) =>
            onChange({ ...filters, year: [filters.year[0], Number(event.target.value)] })
          }
        />
      </fieldset>
      <button className="reset-button" type="button" onClick={onReset}>
        Скинути фільтри
      </button>
    </aside>
  )
}
