import { Link } from 'react-router-dom'

export function AuthGatePage() {
  return (
    <div>
      <h1>Потрібна авторизація</h1>
      <Link to="/login">Увійти</Link>
    </div>
  )
}
