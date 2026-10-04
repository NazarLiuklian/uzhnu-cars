import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function ProfilePage() {
  const [saved, setSaved] = useState(false)

  return (
    <section className="profile-page">
      <Card className="profile-settings-card">
        <div className="profile-settings-heading">
          <h1>Налаштування облікового запису</h1>
          <p>Керування особистими даними, поштою та безпекою</p>
        </div>
        <div className="profile-avatar-row">
          <div className="avatar avatar--large">НЛ</div>
          <div>
            <span className="profile-field-title">Фотографія профілю (Аватарка)</span>
            <div className="profile-avatar-actions">
              <Button variant="secondary">Завантажити нове фото</Button>
              <button className="text-button text-button--danger" type="button">Видалити</button>
            </div>
          </div>
        </div>
        <div className="profile-settings-section">
          <h2>Особисті дані</h2>
          <div className="profile-fields profile-fields--two">
            <Input id="full-name" label="Ім'я та прізвище" defaultValue="Назар Люклян" />
            <Input id="nickname" label="Нікнейм користувача" defaultValue="nazar_liuklian" />
          </div>
        </div>
        <div className="profile-settings-section">
          <h2>Контактна пошта</h2>
          <label className="field">
            <span className="field__label">Адреса електронної пошти</span>
            <div className="profile-email-row">
              <input className="input" type="email" defaultValue="nazar.liuklian@uzhnu.edu.ua" />
              <Button variant="soft">Змінити пошту</Button>
            </div>
            <span className="field__hint">На нову пошту буде надіслано лист із посиланням для підтвердження</span>
          </label>
        </div>
        <div className="profile-settings-section profile-settings-section--security">
          <h2>Безпека (Зміна пароля)</h2>
          <Input id="current-password" type="password" label="Поточний пароль" placeholder="••••••••••••" />
          <div className="profile-fields profile-fields--two">
            <Input id="new-password" type="password" label="Новий пароль" placeholder="Введіть новий пароль" />
            <Input id="repeat-password" type="password" label="Повторіть новий пароль" placeholder="Повторіть пароль" />
          </div>
        </div>
        <div className="profile-actions">
          <Button variant="ghost">Скасувати</Button>
          <Button onClick={() => setSaved(true)}>Зберегти всі зміни</Button>
        </div>
        {saved && <span className="save-confirmation">Зміни збережено</span>}
      </Card>
    </section>
  )
}
