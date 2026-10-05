import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <nav>
      <NavLink to="/">УжНУ Cars</NavLink> <NavLink to="/stats">Статистика</NavLink>{' '}
      <NavLink to="/add-car">Додати авто</NavLink> <NavLink to="/profile">Профіль</NavLink>
    </nav>
  )
}
