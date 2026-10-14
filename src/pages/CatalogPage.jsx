import { useState } from 'react'
import { CarCard } from '../components/CarCard/CarCard'
import { SidebarFilter } from '../components/SidebarFilter/SidebarFilter'
import styles from './CatalogPage.module.css'

export function CatalogPage({ cars, isAuth, onToggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const handleReset = () => {
    setSearchTerm('')
    setSelectedDept('')
    setSelectedFuel('')
    setOnlyFavorites(false)
  }

  const filteredCars = cars.filter((car) => {
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      const matchBrand = car.brand.toLowerCase().includes(query)
      const matchModel = car.model.toLowerCase().includes(query)
      const matchOwner = car.owner.toLowerCase().includes(query)
      if (!matchBrand && !matchModel && !matchOwner) return false
    }
    if (selectedDept && car.faculty !== selectedDept) {
      return false
    }
    if (selectedFuel && car.fuel !== selectedFuel) {
      return false
    }
    if (onlyFavorites && !car.favorite) {
      return false
    }
    return true
  })

  return (
    <main className={styles.main}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Пошук за прізвищем або маркою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.layout}>
        <SidebarFilter
          isAuth={isAuth}
          selectedDepartment={selectedDept}
          onSelectDepartment={setSelectedDept}
          selectedFuel={selectedFuel}
          onSelectFuel={setSelectedFuel}
          onlyFavorites={onlyFavorites}
          onToggleFavorites={setOnlyFavorites}
          onReset={handleReset}
        />

        <section className={styles.cardsGrid}>
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                showFavorite={isAuth}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Автомобілів за заданими параметрами не знайдено</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
