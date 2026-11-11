import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './Header.module.css'

export function Header({ user: propUser }) {
  const location = useLocation()
  const { user: authUser } = useAuth()
  const user = propUser !== undefined ? propUser : authUser
  const isAuth = Boolean(user)

  const isLoginPage = location.pathname === '/login'
  const isProfilePage = location.pathname === '/profile'

  const isAvatarImage =
    user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))

  if (isLoginPage) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.brand}>
            <div className={styles.logoBadge}>🚗 УжУ Cars</div>
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
          <div className={styles.logoBadge}>🚗 УжУ Cars</div>
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
                  <div className={styles.avatar}>
                    {isAvatarImage ? (
                      <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                    ) : (
                      user.avatar || '👤'
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login" state={{ from: '/profile' }} className={styles.loginButton}>
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
