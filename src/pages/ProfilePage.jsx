import { useEffect, useState } from 'react'
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
  const baseFirstName = activeUser?.firstName || nameParts[0] || ''
  const baseLastName = activeUser?.lastName || nameParts.slice(1).join(' ') || ''
  const baseEmail = activeUser?.email || ''
  const baseAvatar = activeUser?.avatar || ''

  const [savedBaseline, setSavedBaseline] = useState({
    firstName: baseFirstName,
    lastName: baseLastName,
    avatar: baseAvatar,
  })

  // Editable form states
  const [firstName, setFirstName] = useState(baseFirstName)
  const [lastName, setLastName] = useState(baseLastName)
  const [avatar, setAvatar] = useState(baseAvatar)
  const [newPassword, setNewPassword] = useState('')

  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(false)

  // Avatar upload modal
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedFileBase64, setSelectedFileBase64] = useState('')

  // Стан заявок на модерацію (для ролі admin)
  const isAdmin = activeUser?.role === 'admin'
  const [pendingCars, setPendingCars] = useState([])
  const [loadingPending, setLoadingPending] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    if (activeUser) {
      const parts = (activeUser.name || '').split(' ')
      const fn = activeUser.firstName || parts[0] || ''
      const ln = activeUser.lastName || parts.slice(1).join(' ') || ''
      const av = activeUser.avatar || ''
      setFirstName(fn)
      setLastName(ln)
      setAvatar(av)
      setSavedBaseline({
        firstName: fn,
        lastName: ln,
        avatar: av,
      })
    }
  }, [activeUser])

  useEffect(() => {
    if (isAdmin) {
      setLoadingPending(true)
      api
        .getPendingCars()
        .then((data) => setPendingCars(data || []))
        .catch((err) => console.error('Помилка завантаження заявок на модерацію:', err))
        .finally(() => setLoadingPending(false))
    }
  }, [isAdmin])

  const handleApproveCar = async (carId) => {
    try {
      await api.approveCar(carId)
      setPendingCars((prev) => prev.filter((c) => c.id !== carId))
      setActionMessage('Автомобіль успішно опубліковано в каталозі!')
      setTimeout(() => setActionMessage(''), 4000)
    } catch (err) {
      alert(err.message || 'Не вдалося опублікувати автомобіль')
    }
  }

  const handleRejectCar = async (carId) => {
    if (!window.confirm('Ви впевнені, що хочете відхилити та видалити цю заявку?')) {
      return
    }
    try {
      await api.deleteCar(carId)
      setPendingCars((prev) => prev.filter((c) => c.id !== carId))
      setActionMessage('Заявку успішно відхилено та видалено.')
      setTimeout(() => setActionMessage(''), 4000)
    } catch (err) {
      alert(err.message || 'Не вдалося відхилити заявку')
    }
  }

  const isAvatarImage = avatar && (avatar.startsWith('http') || avatar.startsWith('data:'))

  // Check if any fields or avatar have been modified
  const hasChanges =
    firstName.trim() !== savedBaseline.firstName ||
    lastName.trim() !== savedBaseline.lastName ||
    avatar !== savedBaseline.avatar ||
    Boolean(newPassword.trim())

  const validate = () => {
    const errors = {}

    if (!firstName.trim()) {
      errors.firstName = 'Введіть імʼя'
    }

    if (!lastName.trim()) {
      errors.lastName = 'Введіть прізвище'
    }

    if (newPassword.trim() && newPassword.trim().length < 6) {
      errors.newPassword = 'Новий пароль повинен мати від 6 символів'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      const updated = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
        ...(newPassword.trim() ? { newPassword: newPassword.trim() } : {}),
      }

      if (updateProfile) {
        const savedUser = await updateProfile(updated)
        onUpdateUser?.(savedUser || updated)
      } else {
        onUpdateUser?.(updated)
      }

      setNewPassword('')

      setSavedBaseline({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar,
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
          <h1 className={styles.title}>
            Налаштування облікового запису
            {isAdmin && (
              <span className={styles.adminBadge} style={{ marginLeft: '0.75rem' }}>
                Адміністратор {pendingCars.length > 0 && `(🔔 ${pendingCars.length} на модерації)`}
              </span>
            )}
          </h1>
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

        {/* Form Fields */}
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
              value={baseEmail}
              readOnly
              className={`${styles.input} ${styles.highlightInput}`}
              placeholder="example@student.uzhnu.edu.ua"
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

        {/* Bottom Actions: Logout & Dynamic Save */}
        <div className={styles.actionsRow}>
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

          <button
            type="button"
            onClick={handleSave}
            className={styles.saveBtn}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </div>

      {/* Панель адміністратора: Блок «Заявки на модерацію» */}
      {isAdmin && (
        <section className={styles.adminSection}>
          <div className={styles.adminHeader}>
            <h2 className={styles.adminTitle}>
              <span>🛡️ Панель модерації автомобілів</span>
            </h2>
            <span
              className={styles.adminBadge}
              style={
                pendingCars.length > 0
                  ? { backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 800 }
                  : {}
              }
            >
              {pendingCars.length > 0
                ? `🔥 Очікують перевірки: ${pendingCars.length}`
                : 'Усі заявки перевірено ✓'}
            </span>
          </div>

          {actionMessage && (
            <div className={styles.successBanner} role="status">
              <span>✓</span>
              <span>{actionMessage}</span>
            </div>
          )}

          {loadingPending && (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Завантаження заявок із бази даних... ⏳
            </p>
          )}

          {!loadingPending && pendingCars.length === 0 && (
            <div className={styles.emptyPending}>
              🎉 Усі заявки опрацьовано. Немає автомобілів, які очікують модерації.
            </div>
          )}

          {!loadingPending && pendingCars.length > 0 && (
            <div className={styles.pendingList}>
              {pendingCars.map((car) => (
                <div key={car.id} className={styles.pendingCard}>
                  {car.image || car.imageUrl ? (
                    <div className={styles.pendingImageWrapper}>
                      <img
                        src={car.image || car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className={styles.pendingImg}
                      />
                    </div>
                  ) : null}

                  <div className={styles.pendingInfo}>
                    <h3 className={styles.pendingCarTitle}>
                      {car.brand} {car.model} ({car.year} р.)
                    </h3>
                    <p className={styles.pendingCarTeacher}>
                      👤 Викладач: <strong>{car.teacher_name || car.owner}</strong> • 🏛{' '}
                      {car.department || car.faculty}
                    </p>
                    <div className={styles.pendingCarMeta}>
                      <span className={styles.pendingMetaBadge}>
                        Паливо: {car.fuel || car.fuel_type || 'Бензин'}
                        {car.engineVolume || car.engine_volume
                          ? ` (${car.engineVolume || car.engine_volume})`
                          : ''}
                      </span>
                      {car.transmission && (
                        <span className={styles.pendingMetaBadge}>КПП: {car.transmission}</span>
                      )}
                      {car.color && (
                        <span className={styles.pendingMetaBadge}>Колір: {car.color}</span>
                      )}
                      {car.notes && (
                        <span className={styles.pendingMetaBadge}>Нотатки: {car.notes}</span>
                      )}
                      {car.author_name && (
                        <span className={styles.pendingMetaBadge}>
                          Додав(ла): {car.author_name} ({car.author_email})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.pendingActions}>
                    <button
                      type="button"
                      className={styles.approveBtn}
                      onClick={() => handleApproveCar(car.id)}
                      title="Схвалити та опублікувати в каталозі"
                    >
                      ✓ Опублікувати
                    </button>
                    <button
                      type="button"
                      className={styles.rejectBtn}
                      onClick={() => handleRejectCar(car.id)}
                      title="Відхилити та видалити заявку"
                    >
                      ✕ Відхилити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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
