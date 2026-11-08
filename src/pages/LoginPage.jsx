import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.css'

export function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isLoading, error: authError, clearError } = useAuth()

  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const handleToggleMode = () => {
    setIsRegisterMode((prev) => !prev)
    setFormErrors({})
    clearError()
  }

  const validate = () => {
    const errors = {}

    if (isRegisterMode) {
      if (!name.trim()) {
        errors.name = 'Введіть ваше імʼя та прізвище'
      } else if (name.trim().length < 2) {
        errors.name = 'Імʼя має містити щонайменше 2 символи'
      }
    }

    if (!email.trim()) {
      errors.email = 'Будь ласка, введіть електронну пошту'
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Введіть коректну адресу пошти (наприклад: example@email.com)'
    }

    if (!password) {
      errors.password = 'Будь ласка, введіть пароль'
    } else if (password.length < 6) {
      errors.password = 'Пароль повинен містити щонайменше 6 символів'
    }

    if (isRegisterMode) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Повторіть введений пароль'
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Паролі не співпадають'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    if (!validate()) {
      return
    }

    try {
      let user
      if (isRegisterMode) {
        user = await register({ name, email, password })
      } else {
        user = await login({ email, password })
      }

      onLogin?.(user)

      // Redirect according to intent
      const destination = location.state?.from || '/profile'
      navigate(destination, { replace: true })
    } catch {
      // Error handled and set by AuthContext
    }
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: null }))
    }
    clearError()
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: null }))
    }
    clearError()
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: null }))
    }
    clearError()
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    if (formErrors.confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: null }))
    }
    clearError()
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            {isRegisterMode ? 'Створення акаунту' : 'Вхід в систему'}
          </h1>
          <p className={styles.subtitle}>
            {isRegisterMode
              ? 'Зареєструйтесь для доступу до додавання автомобілів'
              : 'Авторизуйтесь для доступу до додавання авто'}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {isRegisterMode && (
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">
                Ім&apos;я та прізвище
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                placeholder="ВВеедіть ваще ім'я та прізвище"
                required
              />
              {formErrors.name && <span className={styles.fieldError}>{formErrors.name}</span>}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              Електронна пошта
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
              placeholder="example@email.com"
              required
            />
            {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.passwordLabelRow}>
              <label className={styles.label} htmlFor="password">
                Пароль
              </label>
              {!isRegisterMode && <span className={styles.forgotLink}>Забули?</span>}
            </div>
            <input
              id="password"
              type="text"
              autoComplete="off"
              data-lpignore="true"
              value={password}
              onChange={handlePasswordChange}
              className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
              placeholder={
                isRegisterMode ? 'Придумайте пароль (від 6 символів)' : 'Введіть ваш пароль'
              }
              required
            />
            {formErrors.password && (
              <span className={styles.fieldError}>{formErrors.password}</span>
            )}
          </div>

          {isRegisterMode && (
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirmPassword">
                Повторіть ваш пароль
              </label>
              <input
                id="confirmPassword"
                type="text"
                autoComplete="off"
                data-lpignore="true"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Повторіть ваш пароль"
                required
              />
              {formErrors.confirmPassword && (
                <span className={styles.fieldError}>{formErrors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading
              ? isRegisterMode
                ? 'Створення акаунту... ⏳'
                : 'Авторизація... ⏳'
              : isRegisterMode
                ? 'Зареєструватися та продовжити →'
                : 'Увійти та продовжити →'}
          </button>

          {authError && (
            <div className={styles.errorBanner} role="alert">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}
        </form>

        <div className={styles.footer}>
          {isRegisterMode ? (
            <>
              Вже маєте акаунт?{' '}
              <button type="button" className={styles.registerLink} onClick={handleToggleMode}>
                Увійти
              </button>
            </>
          ) : (
            <>
              Ще не зареєстровані?{' '}
              <button type="button" className={styles.registerLink} onClick={handleToggleMode}>
                Створити акаунт
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
