import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.css'

export function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    isLoading,
    error: authError,
    clearError,
  } = useAuth()

  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const [isResetMode, setIsResetMode] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [devCode, setDevCode] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [loginSuccessNotice, setLoginSuccessNotice] = useState('')

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setResetMessage('')
    setResetError('')

    if (!resetEmail.trim()) {
      setResetError('Введіть адресу електронної пошти')
      return
    }
    if (!resetEmail.includes('@') || !resetEmail.includes('.')) {
      setResetError('Введіть коректну адресу пошти')
      return
    }

    try {
      const res = await forgotPassword(resetEmail.trim())
      if (res?.devCode) {
        setDevCode(res.devCode)
        setResetCode(res.devCode)
      }
      setResetMessage(res?.message || 'Код підтвердження надіслано на вашу пошту')
      setResetStep(2)
    } catch (error) {
      setResetError(error.message || 'Не вдалося надіслати код підтвердження')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetMessage('')
    setResetError('')

    if (!resetCode.trim()) {
      setResetError('Введіть 6-значний код підтвердження')
      return
    }
    if (resetCode.trim().length !== 6) {
      setResetError('Код підтвердження має містити 6 цифр')
      return
    }
    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetError('Пароль повинен містити щонайменше 6 символів')
      return
    }

    try {
      const res = await resetPassword({
        email: resetEmail.trim(),
        code: resetCode.trim(),
        newPassword: resetNewPassword,
      })
      setLoginSuccessNotice(res?.message || 'Пароль успішно змінено! Тепер ви можете увійти.')
      setIsResetMode(false)
      setResetStep(1)
      setResetEmail('')
      setResetCode('')
      setResetNewPassword('')
      setDevCode('')
      setResetMessage('')
      setResetError('')
    } catch (error) {
      setResetError(error.message || 'Не вдалося змінити пароль')
    }
  }

  const handleCancelReset = () => {
    setIsResetMode(false)
    setResetStep(1)
    setResetEmail('')
    setResetCode('')
    setResetNewPassword('')
    setDevCode('')
    setResetMessage('')
    setResetError('')
  }

  const handleToggleMode = () => {
    setIsRegisterMode((prev) => !prev)
    setIsResetMode(false)
    setResetStep(1)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFormErrors({})
    setResetMessage('')
    setResetError('')
    setLoginSuccessNotice('')
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
    } else if (
      isRegisterMode &&
      !email.trim().toLowerCase().endsWith('@uzhnu.edu.ua') &&
      !email.trim().toLowerCase().endsWith('@student.uzhnu.edu.ua')
    ) {
      errors.email =
        'Реєстрація дозволена лише для поштових скриньок УжНУ (@uzhnu.edu.ua або @student.uzhnu.edu.ua)'
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Введіть коректну адресу пошти'
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

      const destination = location.state?.from || '/profile'
      navigate(destination, { replace: true })
    } catch {
      // Error handled by AuthContext
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
    setLoginSuccessNotice('')
    clearError()
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: null }))
    }
    setLoginSuccessNotice('')
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
            {isResetMode
              ? 'Відновлення пароля'
              : isRegisterMode
                ? 'Створення акаунту'
                : 'Вхід в систему'}
          </h1>
          <p className={styles.subtitle}>
            {isResetMode
              ? resetStep === 1
                ? 'Введіть вашу електронну пошту для отримання коду підтвердження'
                : 'Введіть код підтвердження та придумайте новий пароль'
              : isRegisterMode
                ? 'Зареєструйтесь для доступу до додавання автомобілів'
                : 'Авторизуйтесь для доступу до додавання авто'}
          </p>
        </div>

        {isResetMode && resetStep === 1 && (
          <form className={styles.resetBox} onSubmit={handleRequestCode} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="resetEmail">
                Електронна пошта
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value)
                  setResetError('')
                }}
                className={styles.input}
                placeholder="example@student.uzhnu.edu.ua"
                autoComplete="off"
                required
              />
            </div>

            {resetError && (
              <div className={styles.errorBanner} role="alert">
                <span>⚠️</span>
                <span>{resetError}</span>
              </div>
            )}

            {resetMessage && (
              <div className={styles.successBanner} role="status">
                <span>✓</span>
                <span>{resetMessage}</span>
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Надсилання коду... ⏳' : 'Отримати код підтвердження →'}
            </button>

            <button
              type="button"
              className={styles.registerLink}
              style={{ marginTop: '12px', display: 'block', width: '100%' }}
              onClick={handleCancelReset}
            >
              Повернутися до входу
            </button>
          </form>
        )}

        {isResetMode && resetStep === 2 && (
          <form className={styles.resetBox} onSubmit={handleResetPassword} noValidate>
            <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
              Код надіслано на адресу: <strong>{resetEmail}</strong>
            </div>

            {devCode && (
              <div className={styles.devBanner} role="status">
                <span>🔑</span>
                <span>
                  Код підтвердження (тестовий режим): <strong>{devCode}</strong>
                </span>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="resetCode">
                Код підтвердження (6 цифр)
              </label>
              <input
                id="resetCode"
                type="text"
                maxLength={6}
                value={resetCode}
                onChange={(e) => {
                  setResetCode(e.target.value)
                  setResetError('')
                }}
                className={styles.input}
                placeholder="123456"
                autoComplete="off"
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="resetNewPassword">
                Новий пароль
              </label>
              <input
                id="resetNewPassword"
                type="text"
                value={resetNewPassword}
                onChange={(e) => {
                  setResetNewPassword(e.target.value)
                  setResetError('')
                }}
                className={styles.input}
                placeholder="Введіть новий пароль"
                autoComplete="off"
                data-lpignore="true"
                required
              />
            </div>

            {resetError && (
              <div className={styles.errorBanner} role="alert">
                <span>⚠️</span>
                <span>{resetError}</span>
              </div>
            )}

            {resetMessage && (
              <div className={styles.successBanner} role="status">
                <span>✓</span>
                <span>{resetMessage}</span>
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Збереження пароля... ⏳' : 'Змінити пароль'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <button
                type="button"
                className={styles.registerLink}
                onClick={() => {
                  setResetStep(1)
                  setResetError('')
                  setResetMessage('')
                }}
              >
                ← Змінити пошту
              </button>
              <button type="button" className={styles.registerLink} onClick={handleCancelReset}>
                Повернутися до входу
              </button>
            </div>
          </form>
        )}

        {!isResetMode && loginSuccessNotice && (
          <div className={styles.successBanner} role="status">
            <span>✓</span>
            <span>{loginSuccessNotice}</span>
          </div>
        )}

        {!isResetMode && (
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
                  placeholder="Введіть ваше ім'я та прізвище"
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
                autoComplete="off"
                required
              />
              {formErrors.email && <span className={styles.fieldError}>{formErrors.email}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.passwordLabelRow}>
                <label className={styles.label} htmlFor="password">
                  Пароль
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    className={styles.forgotLink}
                    onClick={() => {
                      setIsResetMode(true)
                      setResetStep(1)
                      setResetEmail(email || '')
                      setResetCode('')
                      setResetNewPassword('')
                      setDevCode('')
                      setResetMessage('')
                      setResetError('')
                      setLoginSuccessNotice('')
                      clearError()
                    }}
                  >
                    Забули?
                  </button>
                )}
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
                  autoComplete="nopassword"
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
        )}

        {!isResetMode && (
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
        )}
      </div>
    </main>
  )
}
