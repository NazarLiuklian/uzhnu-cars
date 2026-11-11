import { Trash2 } from 'lucide-react'
import styles from './CarCard.module.css'

export function CarCard({ car, showFavorite, onToggleFavorite, onDelete, onClick }) {
  const isFav = car.favorite

  return (
    <article
      className={styles.card}
      onClick={() => onClick?.(car)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(car)
        }
      }}
    >
      {showFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite && onToggleFavorite(car.id)
          }}
          className={`${styles.favoriteButton} ${isFav ? styles.favoriteActive : ''}`}
          aria-label="Додати в обране"
          title={isFav ? 'В обраному' : 'Додати в обране'}
        >
          {isFav ? '♥' : '♡'}
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            void onDelete(car.id).catch(() => {})
          }}
          className={styles.deleteButton}
          aria-label={`Видалити ${car.brand} ${car.model}`}
          title="Видалити авто"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      )}

      <div className={styles.imagePlaceholder}>
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className={styles.carImg}
            loading="lazy"
          />
        ) : (
          <span>{car.imageText || `[ Фото Авто ${car.brand} ]`}</span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>
          {car.brand} {car.model}
        </h3>
        <p className={styles.owner}>Власник: {car.owner}</p>
        <div className={styles.tagsRow}>
          <span className={styles.tag}>{car.faculty}</span>
          <span className={styles.tag}>{car.fuel}</span>
          <span className={styles.tag}>{car.year} р.</span>
        </div>
      </div>
    </article>
  )
}
