import { BarChart3, CarFront, LockKeyhole, PlusCircle } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Каталог', icon: CarFront },
  { to: '/stats', label: 'Статистика', icon: BarChart3 },
  { to: '/add-car', label: 'Додати авто', icon: PlusCircle },
]

export function Navbar({ isAuthenticated }) {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        <span className="brand__mark">🚗</span>
        <span>
          УжНУ <strong>Cars</strong>
        </span>
      </NavLink>
      <nav className="nav-links" aria-label="Головна навігація">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink className="nav-link" to={to} key={to}>
            <Icon size={17} /> {label}
            {to === '/add-car' && !isAuthenticated && <LockKeyhole size={14} />}
          </NavLink>
        ))}
      </nav>
      {isAuthenticated ? (
        <NavLink className="profile-link profile-link--user" to="/profile" aria-label="Профіль Назар Люклян">
          <span className="avatar avatar--nav">НЛ</span>
          <span className="profile-link__text">Назар Люклян</span>
        </NavLink>
      ) : (
        <NavLink className="profile-link" to="/auth">Увійти</NavLink>
      )}
    </header>
  )
}
