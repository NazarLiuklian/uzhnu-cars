import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AuthGatePage() {
  return (
    <section className="auth-page">
      <div className="auth-panel auth-gate">
        <div className="auth-gate__icon">
          <LockKeyhole size={28} />
        </div>
        <span className="eyebrow">Доступ обмежено</span>
        <h1>Потрібна авторизація</h1>
        <p>Увійдіть через корпоративну пошту УжНУ, щоб запропонувати автомобіль до каталогу.</p>
        <Link className="button button--primary auth-gate__button" to="/auth">
          Увійти <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}
