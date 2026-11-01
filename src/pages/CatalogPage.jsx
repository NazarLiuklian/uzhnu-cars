import { CarCard } from '../components/CarCard/CarCard'
import { SidebarFilter } from '../components/SidebarFilter/SidebarFilter'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { useCars } from '../hooks/useCars'
import styles from './CatalogPage.module.css'

export function CatalogPage() {
  const { isAuth } = useAuth()
  const {
    filteredCars,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFuel,
    setSelectedFuel,
    onlyFavorites,
    setOnlyFavorites,
    selectedCar,
    setSelectedCar,
    toggleFavorite,
    resetFilters,
    refetch,
  } = useCars()

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
          onReset={resetFilters}
        />

        <section className={styles.cardsGrid}>
          {isLoading && (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonLineTitle} />
                    <div className={styles.skeletonLineSub} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>⚠️</div>
              <h3 className={styles.errorTitle}>Помилка завантаження</h3>
              <p className={styles.errorText}>{error}</p>
              <button type="button" onClick={refetch} className={styles.retryBtn}>
                Спробувати знову
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredCars.length > 0 &&
            filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                showFavorite={isAuth}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedCar}
              />
            ))}

          {!isLoading && !error && filteredCars.length === 0 && (
            <div className={styles.emptyState}>
              <p>Автомобілів за заданими параметрами не знайдено</p>
              {(searchTerm || selectedDept || selectedFuel || onlyFavorites) && (
                <button type="button" onClick={resetFilters} className={styles.resetBtn}>
                  Скинути всі фільтри
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Car Details Modal */}
      <Modal
        isOpen={Boolean(selectedCar)}
        onClose={() => setSelectedCar(null)}
        title={selectedCar ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})` : ''}
      >
        {selectedCar && (
          <div className={styles.modalDetails}>
            <div className={styles.modalImage}>
              <span>{selectedCar.imageText || `[ Фото ${selectedCar.brand} ]`}</span>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Власник</span>
                <span className={styles.detailValue}>{selectedCar.owner}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Кафедра</span>
                <span className={styles.detailValue}>{selectedCar.faculty}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Рік випуску</span>
                <span className={styles.detailValue}>{selectedCar.year} р.</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Тип палива</span>
                <span className={styles.detailValue}>{selectedCar.fuel}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Трансмісія</span>
                <span className={styles.detailValue}>
                  {selectedCar.transmission || 'Автоматична'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Двигун / Батарея</span>
                <span className={styles.detailValue}>{selectedCar.engineVolume || '2.0 л'}</span>
              </div>
              <div className={`${styles.detailItem} ${styles.detailFull}`}>
                <span className={styles.detailLabel}>Нотатки та деталі</span>
                <div className={styles.notesBox}>
                  {selectedCar.notes ||
                    'Автомобіль викладача УжНУ. Додаткова інформація перевірена модератором.'}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              {isAuth ? (
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedCar.id)}
                  className={`${styles.favBtn} ${selectedCar.favorite ? styles.favActive : ''}`}
                >
                  <span>{selectedCar.favorite ? '♥ В обраному' : '♡ Додати в обране'}</span>
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className={styles.closeModalBtn}
              >
                Закрити
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
