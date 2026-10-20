import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfilePage.module.css'

export function ProfilePage({ user, onUpdateUser }) {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState(user?.name || 'Назар Люклян')
  const [username, setUsername] = useState('nazar_liuklian')
  const [email, setEmail] = useState(user?.email || 'nazar.liuklian@uzhnu.edu.ua')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: fullName,
        email,
      })
    }
    navigate('/')
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Налаштування облікового запису</h1>
          <p className={styles.subtitle}>Керування особистими даними, поштою та безпекою</p>
        </div>

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>{user?.avatar || 'НЛ'}</div>
          <div className={styles.avatarActions}>
            <span className={styles.avatarLabel}>Фотографія профілю (Аватарка)</span>
            <div className={styles.avatarButtonsRow}>
              <button type="button" className={styles.uploadPhotoBtn}>
                Завантажити нове фото
              </button>
              <button type="button" className={styles.deletePhotoBtn}>
                Видалити
              </button>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Особисті дані</h3>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ім&apos;я та прізвище</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Нікнейм користувача</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Контактна пошта</h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Адреса електронної пошти</label>
            <div className={styles.emailInputRow}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
              <button type="button" className={styles.changeEmailBtn}>
                Змінити пошту
              </button>
            </div>
            <p className={styles.hint}>
              На нову пошту буде надіслано лист із посиланням для підтвердження
            </p>
          </div>
        </div>

        {/* Security */}
        <div className={`${styles.section} ${styles.sectionLast}`}>
          <h3 className={styles.sectionTitle}>Безпека (Зміна пароля)</h3>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Поточний пароль</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Новий пароль</label>
              <input
                type="password"
                placeholder="Введіть новий пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Повторіть новий пароль</label>
              <input
                type="password"
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" onClick={() => navigate('/')} className={styles.cancelBtn}>
            Скасувати
          </button>
          <button type="button" onClick={handleSave} className={styles.saveBtn}>
            Зберегти всі зміни
          </button>
        </div>
      </div>
    </main>
  )
}
