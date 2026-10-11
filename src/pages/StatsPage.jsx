import { StatBar } from '../components/StatBar/StatBar'
import { statsData } from '../services/mockData'
import styles from './StatsPage.module.css'

export function StatsPage() {
  const { engineRatio, topBrands, counters } = statsData

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Аналітика автопарку УжНУ</h1>

      <div className={styles.chartsGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Співвідношення двигунів</h2>
          <div className={styles.engineChartArea}>
            <div className={styles.progressBar}>
              <div className={styles.progressElectro} style={{ width: `${engineRatio.electro}%` }}>
                {engineRatio.electro}%
              </div>
              <div className={styles.progressIce} style={{ width: `${engineRatio.ice}%` }}>
                {engineRatio.ice}%
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
          <h2 className={styles.cardTitle}>Топ брендів</h2>
          <div className={styles.barChartArea}>
            {topBrands.map((brand) => (
              <StatBar
                key={brand.brand}
                label={brand.brand}
                count={brand.count}
                height={brand.height}
                color={brand.color}
              />
            ))}
          </div>
        </section>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.totalCars}</span>
          <span className={styles.metricLabel}>Автомобілі у базі</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.uniqueBrands}</span>
          <span className={styles.metricLabel}>Унікальних брендів</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricNumber}>{counters.averageYear}</span>
          <span className={styles.metricLabel}>Середній вік</span>
        </div>
      </div>
    </main>
  )
}
