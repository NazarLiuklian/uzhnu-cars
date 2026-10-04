import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CarCard } from '../features/catalog/CarCard'
import { FilterPanel } from '../features/catalog/FilterPanel'
import { cars } from '../services/mockData'

const initialFilters = { department: [], fuel: [], year: [2000, 2026] }

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [mobileFilters, setMobileFilters] = useState(false)
  const visibleCars = useMemo(
    () =>
      cars.filter((car) => {
        const matchesQuery = `${car.model} ${car.teacher}`
          .toLowerCase()
          .includes(query.toLowerCase())
        return (
          matchesQuery &&
          (!filters.department.length || filters.department.includes(car.department)) &&
          (!filters.fuel.length || filters.fuel.includes(car.fuel)) &&
          car.year >= filters.year[0] &&
          car.year <= filters.year[1]
        )
      }),
    [filters, query],
  )

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">Автопарк університету</span>
          <h1>Каталог авто</h1>
          <p>Досліджуйте автомобілі викладачів УжНУ в одному місці.</p>
        </div>
        <div className="intro-count">
          <strong>{visibleCars.length}</strong>
          <span>знайдено авто</span>
        </div>
      </div>
      <div className="searchbar">
        <Search size={19} />
        <input
          aria-label="Пошук авто або викладача"
          placeholder="Пошук за маркою, моделлю або прізвищем..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          className="mobile-filter-button"
          onClick={() => setMobileFilters(!mobileFilters)}
        >
          <SlidersHorizontal size={18} /> Фільтри
        </button>
      </div>
      <div className="catalog-layout">
        <div className={`filter-mobile-wrapper ${mobileFilters ? 'is-open' : ''}`}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(initialFilters)}
          />
        </div>
        <div className="catalog-results">
          <div className="results-toolbar">
            <span>Автомобілі викладачів</span>
            <span className="results-muted">Оновлено сьогодні</span>
          </div>
          <div className="car-grid">
            {visibleCars.length ? (
              visibleCars.map((car) => <CarCard car={car} key={car.id} />)
            ) : (
              <div className="empty-state">За цими параметрами авто не знайдено.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
