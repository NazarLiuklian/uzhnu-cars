import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.codeBadge}>404</div>
        <h1 className={styles.title}>Сторінку не знайдено</h1>
        <p className={styles.description}>
          Здається, такої адреси не існує або сторінку було переміщено. Перевірте правильність
          URL-адреси або поверніться до каталогу.
        </p>
        <Link to="/" className={styles.homeBtn}>
          Повернутися на головну
        </Link>
      </div>
    </main>
  )
}
