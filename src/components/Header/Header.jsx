import styles from './Header.module.css'

export function Header({ activeView, goTo, user, onLogout }) {
  if (activeView === 'login') {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.brand} onClick={() => goTo('catalog')}>
            <div className={styles.logoBadge}>🚗 УжНУ Cars</div>
          </div>
          <span className={styles.authBadge}>Система автентифікації</span>
        </div>
      </header>
    )
  }

  const isAuth = Boolean(user)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand} onClick={() => goTo('catalog')}>
          <div className={styles.logoBadge}>🚗 УжНУ Cars</div>
          <span className={styles.subtitle}>Каталог автомобілів</span>
        </div>

        <nav className={styles.nav}>
          <button
            type="button"
            onClick={() => goTo('catalog')}
            className={`${styles.navButton} ${
              activeView === 'catalog' ? styles.navButtonActive : ''
            }`}
          >
            Каталог
          </button>

          <button
            type="button"
            onClick={() => goTo('stats')}
            className={`${styles.navButton} ${
              activeView === 'stats' ? styles.navButtonActive : ''
            }`}
          >
            Статистика
          </button>

          {activeView === 'profile' ? (
            <>
              <button
                type="button"
                onClick={() => goTo(isAuth ? 'add-car' : 'auth-gate')}
                className={styles.navButton}
              >
                Додати авто
              </button>
              <span className={styles.profileActiveTag}>Налаштування профілю</span>
              <button type="button" onClick={onLogout} className={styles.logoutButton}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goTo(isAuth ? 'add-car' : 'auth-gate')}
                className={`${styles.navButton} ${
                  activeView === 'add-car' || activeView === 'auth-gate'
                    ? styles.navButtonActive
                    : ''
                }`}
              >
                Додати авто {!isAuth && <span className={styles.lockBadge}>🔒</span>}
              </button>

              {isAuth ? (
                <div
                  className={styles.userWidget}
                  onClick={() => goTo('profile')}
                  title="Налаштування профілю"
                >
                  <div className={styles.avatar}>{user.avatar || 'НЛ'}</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => goTo('login')} className={styles.loginButton}>
                  Увійти
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
