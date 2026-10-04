import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthForm } from '../features/auth/AuthForm'

export function AuthPage({ onLogin }) {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link className="back-link" to="/">
          <ArrowLeft size={17} /> Повернутися до каталогу
        </Link>
        <div className="auth-logo">🚗</div>
        <span className="eyebrow">Особистий кабінет</span>
        <h1>Вхід до УжНУ Cars</h1>
        <p>Увійдіть через корпоративну пошту, щоб додавати автомобілі та керувати профілем.</p>
        <AuthForm onLogin={onLogin} />
        <div className="auth-security">
          <LockKeyhole size={15} /> Доступ лише для домену @uzhnu.edu.ua
        </div>
      </div>
    </section>
  )
}
