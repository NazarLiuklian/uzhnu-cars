import { BarChart3, Car, Shapes, Timer } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { StatsChart } from '../features/stats/StatsChart'
import { stats } from '../services/mockData'

export function StatsPage() {
  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">Дані та інсайти</span>
          <h1>Статистика автопарку</h1>
          <p>Короткий зріз автомобілів, які представлені в каталозі.</p>
        </div>
      </div>
      <div className="metric-grid">
        <Card className="metric-card">
          <Car />
          <span>Авто в базі</span>
          <strong>{stats.totalCars}</strong>
          <small>+4 за цей семестр</small>
        </Card>
        <Card className="metric-card">
          <Shapes />
          <span>Унікальних брендів</span>
          <strong>{stats.brands}</strong>
          <small>Різноманітний автопарк</small>
        </Card>
        <Card className="metric-card">
          <Timer />
          <span>Середній рік</span>
          <strong>{stats.averageYear}</strong>
          <small>Середній рік випуску</small>
        </Card>
      </div>
      <div className="analytics-grid">
        <Card className="analytics-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">Пальне</span>
              <h2>Типи двигунів</h2>
            </div>
            <BarChart3 />
          </div>
          <div className="fuel-visual">
            <div className="donut" style={{ '--percent': `${stats.fuel.electric}%` }}>
              <div>
                <strong>30%</strong>
                <span>Електро</span>
              </div>
            </div>
            <div className="legend">
              <span>
                <i className="dot dot--green" />
                Електро <b>30%</b>
              </span>
              <span>
                <i className="dot dot--blue" />
                ДВЗ <b>70%</b>
              </span>
            </div>
          </div>
        </Card>
        <Card className="analytics-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">Популярність</span>
              <h2>Топ брендів</h2>
            </div>
            <span className="small-label">частка каталогу</span>
          </div>
          <StatsChart brands={stats.brandsList} />
        </Card>
      </div>
    </section>
  )
}
