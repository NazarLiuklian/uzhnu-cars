import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

export function Header({ user, onLogout }) {
  const location = useLocation()
  const isAuth = Boolean(user)
  const isLoginPage = location.pathname === '/login'
  const isProfilePage = location.pathname === '/profile'

  if (isLoginPage) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.brand}>
            <div className={styles.logoBadge}>🚗 УжНУ Cars</div>
          </Link>
          <span className={styles.authBadge}>Система автентифікації</span>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <div className={styles.logoBadge}>🚗 УжНУ Cars</div>
          <span className={styles.subtitle}>Каталог автомобілів</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navButton} ${isActive ? styles.navButtonActive : ''}`
            }
          >
            Каталог
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `${styles.navButton} ${isActive ? styles.navButtonActive : ''}`
            }
          >
            Статистика
          </NavLink>

          {isProfilePage ? (
            <>
              <NavLink to={isAuth ? '/add-car' : '/auth-gate'} className={styles.navButton}>
                Додати авто
              </NavLink>
              <span className={styles.profileActiveTag}>Налаштування профілю</span>
              <button type="button" onClick={onLogout} className={styles.logoutButton}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to={isAuth ? '/add-car' : '/auth-gate'}
                className={({ isActive }) =>
                  `${styles.navButton} ${isActive ? styles.navButtonActive : ''}`
                }
              >
                Додати авто {!isAuth && <span className={styles.lockBadge}>🔒</span>}
              </NavLink>

              {isAuth ? (
                <Link to="/profile" className={styles.userWidget} title="Налаштування профілю">
                  <div className={styles.avatar}>{user.avatar || 'НЛ'}</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login" className={styles.loginButton}>
                  Увійти
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
