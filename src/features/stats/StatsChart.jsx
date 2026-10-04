export function StatsChart({ brands }) {
  return (
    <div className="brand-chart" aria-label="Топ брендів">
      {brands.map((brand) => (
        <div className="chart-row" key={brand.name}>
          <span className="chart-row__label">{brand.name}</span>
          <div className="chart-row__track">
            <span className="chart-row__bar" style={{ width: `${brand.value}%` }} />
          </div>
          <strong>{brand.value}%</strong>
        </div>
      ))}
    </div>
  )
}
