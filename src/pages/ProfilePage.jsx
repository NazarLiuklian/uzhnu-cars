import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './ProfilePage.module.css'

export function ProfilePage({ user: propUser, onUpdateUser }) {
  const navigate = useNavigate()
  const { user: authUser, updateProfile, logout, isLoading } = useAuth()
  const activeUser = authUser || propUser

  // Baseline stored user data
  const nameParts = (activeUser?.name || '').split(' ')
  const baseFirstName = nameParts[0] || ''
  const baseLastName = nameParts.slice(1).join(' ') || ''
  const baseEmail = activeUser?.email || ''
  const baseAvatar = activeUser?.avatar || ''

  const registeredUser = api.getRegisteredUser()
  const savedPassword = activeUser?.password || registeredUser?.password || ''

  const [savedBaseline, setSavedBaseline] = useState({
    firstName: baseFirstName,
    lastName: baseLastName,
    email: baseEmail,
    avatar: baseAvatar,
    currentPassword: savedPassword,
  })

  // Editable form states
  const [firstName, setFirstName] = useState(baseFirstName)
  const [lastName, setLastName] = useState(baseLastName)
  const [email, setEmail] = useState(baseEmail)
  const [avatar, setAvatar] = useState(baseAvatar)

  const [currentPassword, setCurrentPassword] = useState(savedPassword)
  const [newPassword, setNewPassword] = useState('')

  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(false)

  // Avatar upload modal
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedFileBase64, setSelectedFileBase64] = useState('')

  const isAvatarImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:'))

  // Check if any fields or avatar have been modified
  const hasChanges =
    firstName.trim() !== savedBaseline.firstName ||
    lastName.trim() !== savedBaseline.lastName ||
    email.trim() !== savedBaseline.email ||
    avatar !== savedBaseline.avatar ||
    currentPassword !== savedBaseline.currentPassword ||
    Boolean(newPassword.trim())

  const validate = () => {
    const errors = {}

    if (!firstName.trim()) {
      errors.firstName = 'Введіть імʼя'
    }

    if (!lastName.trim()) {
      errors.lastName = 'Введіть прізвище'
    }

    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Введіть коректну адресу пошти'
    }

    if (newPassword && newPassword.length < 6) {
      errors.newPassword = 'Новий пароль повинен мати від 6 символів'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      const passwordToSave = newPassword.trim() || currentPassword.trim()
      const updated = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        avatar,
        ...(passwordToSave ? { password: passwordToSave } : {}),
      }

      if (updateProfile) {
        await updateProfile(updated)
      }
      onUpdateUser?.(updated)

      const finalPassword = passwordToSave
      setCurrentPassword(finalPassword)
      setNewPassword('')

      // Update saved baseline to hide the button
      setSavedBaseline({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        avatar,
        currentPassword: finalPassword,
      })

      setSuccessMessage(true)

      setTimeout(() => {
        setSuccessMessage(false)
      }, 3000)
    } catch (err) {
      alert(err.message || 'Помилка оновлення профілю')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedFileBase64(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleApplyAvatar = () => {
    if (!selectedFileBase64) return
    setAvatar(selectedFileBase64)
    setShowPhotoModal(false)
    setSelectedFileBase64('')
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Налаштування облікового запису</h1>
        </div>

        {successMessage && (
          <div className={styles.successBanner} role="status">
            <span>✓</span>
            <span>Дані профілю успішно збережено в системі!</span>
          </div>
        )}

        {/* Clean Avatar Section */}
        <div className={styles.avatarSection}>
          <div
            className={styles.avatarCircle}
            onClick={() => {
              setSelectedFileBase64('')
              setShowPhotoModal(true)
            }}
            title="Натисніть для зміни фото"
          >
            {isAvatarImage ? (
              <img src={avatar} alt={`${firstName} ${lastName}`} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarPlaceholderIcon}>👤</span>
            )}
          </div>
          <button
            type="button"
            className={styles.uploadPhotoBtn}
            onClick={() => {
              setSelectedFileBase64('')
              setShowPhotoModal(true)
            }}
          >
            Завантажити нове фото
          </button>
        </div>

        {/* Unified Form without separator title blocks */}
        <div className={styles.formGrid}>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ім&apos;я</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  if (formErrors.firstName) setFormErrors((p) => ({ ...p, firstName: null }))
                }}
                className={`${styles.input} ${formErrors.firstName ? styles.inputError : ''}`}
                placeholder="Ім'я"
              />
              {formErrors.firstName && (
                <span className={styles.fieldError}>{formErrors.firstName}</span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Прізвище</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  if (formErrors.lastName) setFormErrors((p) => ({ ...p, lastName: null }))
                }}
                className={`${styles.input} ${formErrors.lastName ? styles.inputError : ''}`}
                placeholder="Прізвище"
              />
              {formErrors.lastName && (
                <span className={styles.fieldError}>{formErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={`${styles.label} ${styles.highlightLabel}`}>
              Адреса електронної пошти
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (formErrors.email) setFormErrors((p) => ({ ...p, email: null }))
              }}
              className={`${styles.input} ${styles.highlightInput} ${
                formErrors.email ? styles.inputError : ''
              }`}
              placeholder="example@email.com"
            />
            {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={`${styles.label} ${styles.highlightLabel}`}>Поточний пароль</label>
              <input
                type="text"
                autoComplete="off"
                data-lpignore="true"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${styles.input} ${styles.highlightInput}`}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Новий пароль</label>
              <input
                type="text"
                placeholder="Введіть новий пароль"
                autoComplete="off"
                data-lpignore="true"
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
          </div>
        </div>

        {/* Bottom Actions: Logout & Dynamic Save */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <button
            type="button"
            onClick={async () => {
              await logout()
              navigate('/', { replace: true })
            }}
            className={styles.logoutProfileBtn}
          >
            Вийти з акаунту
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleSave}
              className={styles.saveBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          )}
        </div>
      </div>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false)
          setSelectedFileBase64('')
        }}
        title="Оновлення фото профілю"
      >
        <div className={styles.modalBody}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
            Оберіть нове зображення для вашого профілю у форматі JPG або PNG:
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className={styles.saveBtn}
              style={{ flex: 1 }}
              onClick={handleApplyAvatar}
              disabled={!selectedFileBase64}
            >
              Застосувати аватар
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setShowPhotoModal(false)
                setSelectedFileBase64('')
              }}
            >
              Скасувати
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
