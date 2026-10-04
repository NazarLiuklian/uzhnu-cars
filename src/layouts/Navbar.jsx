import { BarChart3, CarFront, PlusCircle, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Каталог', icon: CarFront },
  { to: '/stats', label: 'Статистика', icon: BarChart3 },
  { to: '/add-car', label: 'Додати авто', icon: PlusCircle },
]

export function Navbar() {
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
          </NavLink>
        ))}
      </nav>
      <NavLink className="profile-link" to="/profile" aria-label="Профіль">
        <UserRound size={18} />
        <span className="profile-link__text">Профіль</span>
      </NavLink>
    </header>
  )
}
