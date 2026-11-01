import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import styles from './ProfilePage.module.css'

export function ProfilePage({ user: propUser, onUpdateUser }) {
  const navigate = useNavigate()
  const { user: authUser, updateProfile, isLoading } = useAuth()
  const activeUser = authUser || propUser

  const [fullName, setFullName] = useState(activeUser?.name || 'Назар Люклян')
  const [username, setUsername] = useState('nazar_liuklian')
  const [email, setEmail] = useState(activeUser?.email || 'nazar.liuklian@uzhnu.edu.ua')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const validate = () => {
    const errors = {}

    if (!fullName.trim()) {
      errors.fullName = 'Імʼя та прізвище не можуть бути порожніми'
    }

    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Введіть коректну адресу пошти'
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        errors.newPassword = 'Новий пароль повинен мати від 6 символів'
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Паролі не співпадають'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      const updated = {
        name: fullName,
        email,
      }

      if (updateProfile) {
        await updateProfile(updated)
      }
      onUpdateUser?.(updated)

      setSuccessMessage(true)
      setTimeout(() => {
        setSuccessMessage(false)
        navigate('/')
      }, 1200)
    } catch (err) {
      alert(err.message || 'Помилка оновлення профілю')
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Налаштування облікового запису</h1>
          <p className={styles.subtitle}>Керування особистими даними, поштою та безпекою</p>
        </div>

        {successMessage && (
          <div className={styles.successBanner} role="status">
            <span>✓</span>
            <span>Дані профілю успішно збережено! Перенаправлення...</span>
          </div>
        )}

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>{activeUser?.avatar || 'НЛ'}</div>
          <div className={styles.avatarActions}>
            <span className={styles.avatarLabel}>Фотографія профілю (Аватарка)</span>
            <div className={styles.avatarButtonsRow}>
              <button
                type="button"
                className={styles.uploadPhotoBtn}
                onClick={() => setShowPhotoModal(true)}
              >
                Завантажити нове фото
              </button>
              <button
                type="button"
                className={styles.deletePhotoBtn}
                onClick={() => alert('Стандартний аватар відновлено')}
              >
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
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (formErrors.fullName) setFormErrors((p) => ({ ...p, fullName: null }))
                }}
                className={`${styles.input} ${formErrors.fullName ? styles.inputError : ''}`}
              />
              {formErrors.fullName && (
                <span className={styles.fieldError}>{formErrors.fullName}</span>
              )}
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (formErrors.email) setFormErrors((p) => ({ ...p, email: null }))
                }}
                className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
              />
              <button
                type="button"
                className={styles.changeEmailBtn}
                onClick={() => alert('Лист із підтвердженням надіслано на вашу нову пошту')}
              >
                Змінити пошту
              </button>
            </div>
            {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
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
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (formErrors.newPassword) setFormErrors((p) => ({ ...p, newPassword: null }))
                }}
                className={`${styles.input} ${formErrors.newPassword ? styles.inputError : ''}`}
              />
              {formErrors.newPassword && (
                <span className={styles.fieldError}>{formErrors.newPassword}</span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Повторіть новий пароль</label>
              <input
                type="password"
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (formErrors.confirmPassword) {
                    setFormErrors((p) => ({ ...p, confirmPassword: null }))
                  }
                }}
                className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ''}`}
              />
              {formErrors.confirmPassword && (
                <span className={styles.fieldError}>{formErrors.confirmPassword}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" onClick={() => navigate('/')} className={styles.cancelBtn}>
            Скасувати
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Збереження...' : 'Зберегти всі зміни'}
          </button>
        </div>
      </div>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Оновлення фото профілю"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.875rem' }}>
            Оберіть нове зображення для вашого профілю у форматі JPG або PNG:
          </p>
          <input type="file" accept="image/*" style={{ margin: '0 auto', display: 'block' }} />
          <button
            type="button"
            className={styles.saveBtn}
            style={{ marginTop: '1.5rem', width: '100%' }}
            onClick={() => {
              alert('Фото успішно завантажено')
              setShowPhotoModal(false)
            }}
          >
            Застосувати
          </button>
        </div>
      </Modal>
    </main>
  )
}
