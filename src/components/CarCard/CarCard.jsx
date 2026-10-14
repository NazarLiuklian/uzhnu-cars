import styles from './CarCard.module.css'

export function CarCard({ car, showFavorite, onToggleFavorite }) {
  const isFav = car.favorite

  return (
    <article className={styles.card}>
      {showFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite && onToggleFavorite(car.id)}
          className={`${styles.favoriteButton} ${isFav ? styles.favoriteActive : ''}`}
          aria-label="Додати в обране"
          title={isFav ? 'В обраному' : 'Додати в обране'}
        >
          {isFav ? '♥' : '♡'}
        </button>
      )}

      <div className={styles.imagePlaceholder}>
        <span>{car.imageText || `[ Фото Авто ${car.brand} ]`}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>
          {car.brand} {car.model}
        </h3>
        <p className={styles.owner}>Власник: {car.owner}</p>
      </div>
    </article>
  )
}
