import { Camera, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function ProfilePage() {
  return (
    <section className="page-section profile-page">
      <div className="page-intro">
        <div>
          <span className="eyebrow">Ваш простір</span>
          <h1>Налаштування профілю</h1>
          <p>Керуйте персональними даними та налаштуваннями доступу.</p>
        </div>
      </div>
      <Card className="profile-card">
        <div className="profile-identity">
          <div className="avatar">
            НЛ
            <button type="button" aria-label="Змінити аватар">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2>Люклян Назар</h2>
            <p>Студент · Користувач з 2026 року</p>
          </div>
        </div>
        <div className="profile-divider" />
        <div className="profile-form">
          <Input id="name" label="Ім’я та прізвище" defaultValue="Люклян Назар" />
          <Input id="nickname" label="Нікнейм" defaultValue="nazar_liuklian" />
          <label className="field">
            <span className="field__label">Корпоративна пошта</span>
            <div className="input-with-icon">
              <Mail size={16} />
              <input className="input" value="nazar.liuklian@student.uzhnu.edu.ua" readOnly />
            </div>
          </label>
        </div>
        <div className="password-section">
          <div>
            <h3>Зміна пароля</h3>
            <p>Рекомендуємо використовувати унікальний пароль.</p>
          </div>
          <Input id="password-new" type="password" placeholder="Новий пароль" />
        </div>
        <Button>Зберегти зміни</Button>
        <div className="privacy-note">
          <ShieldCheck size={16} /> Дані профілю доступні лише вам та адміністраторам платформи.
        </div>
      </Card>
    </section>
  )
}
