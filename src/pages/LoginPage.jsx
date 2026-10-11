import { useState } from 'react'
import styles from './LoginPage.module.css'

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('nazar.liuklian@uzhnu.edu.ua')
  const [password, setPassword] = useState('password123')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({
      name: 'Назар Люклян',
      email: email || 'student@uzhnu.edu.ua',
      avatar: 'НЛ',
    })
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Вхід в систему</h1>
          <p className={styles.subtitle}>Авторизуйтесь для доступу до додавання авто</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Університетська пошта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.passwordLabelRow}>
              <label className={styles.label}>Пароль</label>
              <span className={styles.forgotLink}>Забули?</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Увійти та продовжити →
          </button>
        </form>

        <div className={styles.footer}>
          Ще не зареєстровані? <span className={styles.registerLink}>Створити акаунт</span>
        </div>
      </div>
    </main>
  )
}
