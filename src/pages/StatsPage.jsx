import { useEffect, useState } from 'react'
import { StatBar } from '../components/StatBar/StatBar'
import { api } from '../services/api'
import styles from './StatsPage.module.css'

export function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    api
      .getStats()
      .then((data) => {
        if (isMounted) {
          setStats(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити статистику')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Аналітика автопарку УжНУ</h1>
        <p style={{ color: '#64748b' }}>Завантаження даних із сервера MySQL... ⏳</p>
      </main>
    )
  }

  if (error || !stats) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Аналітика автопарку УжНУ</h1>
        <div
          style={{
            color: '#e11d48',
            background: '#fff1f2',
            padding: '1rem',
            borderRadius: '0.75rem',
          }}
        >
          ⚠️ {error || 'Помилка отримання даних'}
        </div>
      </main>
    )
  }

  const {
    engineRatio = { electro: 0, ice: 100 },
    topBrands = [],
    topDepartments = [],
    fuelDistribution = [],
    counters = {},
  } = stats

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Аналітика автопарку УжНУ</h1>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.totalCars || 0}</span>
          <span className={styles.metricLabel}>Опубліковано в каталозі</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber} style={{ color: '#eab308' }}>
            {counters.pendingCars || 0}
          </span>
          <span className={styles.metricLabel}>Очікують модерації</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.uniqueBrands || 0}</span>
          <span className={styles.metricLabel}>Унікальних брендів</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.averageYear || 2019}</span>
          <span className={styles.metricLabel}>Середній рік випуску</span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Співвідношення двигунів</h2>
          <div className={styles.engineChartArea}>
            <div className={styles.progressBar}>
              <div className={styles.progressElectro} style={{ width: `${engineRatio.electro}%` }}>
                {engineRatio.electro > 0 ? `${engineRatio.electro}%` : ''}
              </div>
              <div className={styles.progressIce} style={{ width: `${engineRatio.ice}%` }}>
                {engineRatio.ice > 0 ? `${engineRatio.ice}%` : ''}
              </div>
            </div>

            <div className={styles.engineBoxes}>
              <div className={`${styles.statBox} ${styles.statBoxElectro}`}>
                <span className={`${styles.statValue} ${styles.statValueElectro}`}>
                  {engineRatio.electro}%
                </span>
                <span className={`${styles.statLabel} ${styles.statLabelElectro}`}>Електро</span>
              </div>
              <div className={`${styles.statBox} ${styles.statBoxIce}`}>
                <span className={`${styles.statValue} ${styles.statValueIce}`}>
                  {engineRatio.ice}%
                </span>
                <span className={`${styles.statLabel} ${styles.statLabelIce}`}>ДВЗ</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Топ брендів (MySQL GROUP BY)</h2>
          <div className={styles.barChartArea}>
            {topBrands.length > 0 ? (
              topBrands.map((brand) => (
                <StatBar
                  key={brand.brand}
                  label={brand.brand}
                  count={brand.count}
                  height={brand.height}
                  color={brand.color}
                />
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Дані відсутні</p>
            )}
          </div>
        </section>
      </div>

      {/* Додаткова аналітика: Розподіл по паливу, кафедрах та екстремуми */}
      <div className={styles.chartsGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Розподіл за типом палива (4 категорії)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {['Бензин', 'Дизель', 'Електро', 'Гібрид'].map((fCategory) => {
              const found = fuelDistribution.find((f) => f.fuel === fCategory)
              const count = found ? found.count : 0
              return (
                <div
                  key={fCategory}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.625rem 0.875rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.625rem',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                    {fCategory}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  >
                    {count} авто
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Розподіл по кафедрах УжНУ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topDepartments.map((dept) => (
              <div
                key={dept.department}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.625rem',
                  border: '1px solid #f1f5f9',
                }}
              >
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                  {dept.department}
                </span>
                <span
                  style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  {dept.count} авто
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Екстремуми автопарку</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            {counters.newestCar && (
              <div
                style={{
                  padding: '0.875rem',
                  borderLeft: '4px solid #10b981',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#15803d',
                    textTransform: 'uppercase',
                  }}
                >
                  ⭐ Найновіше авто
                </span>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginTop: '0.25rem',
                  }}
                >
                  {counters.newestCar.brand} {counters.newestCar.model} ({counters.newestCar.year}{' '}
                  р.)
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Власник: {counters.newestCar.teacher_name}
                </div>
              </div>
            )}

            {counters.oldestCar && (
              <div
                style={{
                  padding: '0.875rem',
                  borderLeft: '4px solid #0284c7',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0369a1',
                    textTransform: 'uppercase',
                  }}
                >
                  🕰 Найстарше авто
                </span>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginTop: '0.25rem',
                  }}
                >
                  {counters.oldestCar.brand} {counters.oldestCar.model} ({counters.oldestCar.year}{' '}
                  р.)
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Власник: {counters.oldestCar.teacher_name}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
