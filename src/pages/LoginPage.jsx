import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div>
      <h1>Вхід</h1>
      <Link to="/add-car">Після входу до додавання авто</Link>
    </div>
  )
}
