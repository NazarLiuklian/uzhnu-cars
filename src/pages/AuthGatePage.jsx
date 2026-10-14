import styles from './AuthGatePage.module.css'

export function AuthGatePage({ goTo }) {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>🔒</div>

        <div className={styles.headerText}>
          <h2 className={styles.title}>Потрібна авторизація</h2>
          <p className={styles.subtitle}>
            Щоб запропонувати нове авто в каталог та відстежувати його модерацію, увійдіть через
            акаунт УжНУ.
          </p>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoHeading}>Чому це обов&apos;язково?</p>
          <p className={styles.infoItem}>
            • Захист від спаму та неправдивих даних про авто викладачів
          </p>
          <p className={styles.infoItem}>• Автоматичне закріплення авторства заявки за студентом</p>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => goTo('login')} className={styles.primaryButton}>
            <span>Перейти до авторизації →</span>
          </button>
          <button type="button" onClick={() => goTo('catalog')} className={styles.secondaryButton}>
            Повернутися до каталогу
          </button>
        </div>
      </div>
    </main>
  )
}
