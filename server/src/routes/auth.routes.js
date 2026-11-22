import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

export const authRouter = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'uzhnu_cars_super_secret_jwt_key_2026'

/**
 * Валідація університетського домену пошти
 */
function isValidUzhnuEmail(email) {
  if (!email || typeof email !== 'string') return false
  const normalized = email.trim().toLowerCase()
  return normalized.endsWith('@uzhnu.edu.ua') || normalized.endsWith('@student.uzhnu.edu.ua')
}

/**
 * Створення транспорту nodemailer (якщо SMTP налаштовано в .env)
 */
function getMailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  }
  return null
}

/**
 * POST /api/auth/register
 */
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Введіть ваше імʼя та прізвище (щонайменше 2 символи)',
      })
    }

    if (!email || !isValidUzhnuEmail(email)) {
      return res.status(400).json({
        error:
          'Реєстрація дозволена лише для поштових скриньок УжНУ (@uzhnu.edu.ua або @student.uzhnu.edu.ua)',
      })
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        error: 'Пароль повинен містити щонайменше 6 символів',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Перевірка чи email вже зайнятий
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail])

    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Користувач з такою електронною поштою вже зареєстрований',
      })
    }

    // Хешування пароля
    const passwordHash = await bcrypt.hash(password, 10)

    const parts = name.trim().split(' ')
    const firstName = parts[0] || ''
    const lastName = parts.slice(1).join(' ') || ''

    // Вставка нового користувача
    const [result] = await pool.query(
      'INSERT INTO users (name, last_name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, normalizedEmail, passwordHash, 'user', ''],
    )

    const user = {
      id: result.insertId,
      name: name.trim(),
      firstName,
      lastName,
      email: normalizedEmail,
      role: 'user',
      avatar: '',
    }

    // Генерація JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' },
    )

    return res.status(201).json({
      message: 'Реєстрація успішна',
      token,
      user,
    })
  } catch (error) {
    console.error('[Auth Register Error]:', error)
    return res.status(500).json({
      error: 'Внутрішня помилка сервера при реєстрації',
    })
  }
})

/**
 * POST /api/auth/login
 */
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Введіть адресу електронної пошти' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Введіть пароль' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const [rows] = await pool.query(
      'SELECT id, name, last_name, email, password_hash, role, avatar FROM users WHERE email = ?',
      [normalizedEmail],
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Невірний email або пароль' })
    }

    const userRecord = rows[0]
    const isPasswordValid = await bcrypt.compare(password, userRecord.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Невірний email або пароль' })
    }

    const fullName = userRecord.last_name
      ? `${userRecord.name} ${userRecord.last_name}`.trim()
      : userRecord.name

    const user = {
      id: userRecord.id,
      name: fullName,
      firstName: userRecord.name,
      lastName: userRecord.last_name || '',
      email: userRecord.email,
      role: userRecord.role,
      avatar: userRecord.avatar || '',
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' },
    )

    return res.json({
      message: 'Авторизація успішна',
      token,
      user,
    })
  } catch (error) {
    console.error('[Auth Login Error]:', error)
    return res.status(500).json({
      error: 'Внутрішня помилка сервера при вході',
    })
  }
})

/**
 * GET /api/auth/me
 */
authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, last_name, email, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Користувача не знайдено' })
    }

    const row = rows[0]
    const fullName = row.last_name ? `${row.name} ${row.last_name}`.trim() : row.name

    const user = {
      id: row.id,
      name: fullName,
      firstName: row.name,
      lastName: row.last_name || '',
      email: row.email,
      role: row.role,
      avatar: row.avatar || '',
      created_at: row.created_at,
    }

    return res.json({ user })
  } catch (error) {
    console.error('[Auth Me Error]:', error)
    return res.status(500).json({
      error: 'Внутрішня помилка сервера при отриманні профілю',
    })
  }
})

/**
 * PUT /api/auth/profile
 * Оновлення профілю (ім'я, прізвище, аватар, пароль)
 */
authRouter.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const { firstName, lastName, name, avatar, newPassword } = req.body

    const finalFirstName = (firstName || name || '').trim()
    const finalLastName = (lastName || '').trim()

    if (!finalFirstName) {
      return res.status(400).json({ error: 'Імʼя є обовʼязковим' })
    }

    // Якщо передано новий пароль, валідуємо довжину
    if (newPassword && newPassword.trim().length > 0 && newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'Новий пароль повинен містити щонайменше 6 символів' })
    }

    if (newPassword && newPassword.trim().length >= 6) {
      const passwordHash = await bcrypt.hash(newPassword.trim(), 10)
      await pool.query(
        'UPDATE users SET name = ?, last_name = ?, avatar = ?, password_hash = ? WHERE id = ?',
        [finalFirstName, finalLastName, avatar || '', passwordHash, userId],
      )
    } else {
      await pool.query('UPDATE users SET name = ?, last_name = ?, avatar = ? WHERE id = ?', [
        finalFirstName,
        finalLastName,
        avatar || '',
        userId,
      ])
    }

    const [updatedRows] = await pool.query(
      'SELECT id, name, last_name, email, role, avatar FROM users WHERE id = ?',
      [userId],
    )

    const updatedUser = updatedRows[0]
    const fullName = updatedUser.last_name
      ? `${updatedUser.name} ${updatedUser.last_name}`.trim()
      : updatedUser.name

    const user = {
      id: updatedUser.id,
      name: fullName,
      firstName: updatedUser.name,
      lastName: updatedUser.last_name || '',
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar || '',
    }

    return res.json({
      message: 'Зміни успішно збережено',
      user,
    })
  } catch (error) {
    console.error('[Update Profile Error]:', error)
    return res.status(500).json({ error: 'Не вдалося оновити дані профілю' })
  }
})

/**
 * POST /api/auth/forgot-password
 * Запит на скидання пароля: генерація 6-значного коду
 */
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Введіть адресу електронної пошти' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const [users] = await pool.query('SELECT id, name FROM users WHERE email = ?', [
      normalizedEmail,
    ])

    if (users.length === 0) {
      return res.status(404).json({ error: 'Користувача з такою електронною поштою не знайдено' })
    }

    // Генерація 6-значного числового коду
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Зберігаємо код у таблиці password_resets на 10 хвилин
    await pool.query(
      `REPLACE INTO password_resets (email, code, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [normalizedEmail, code],
    )

    console.log(`[Password Reset] 🔑 Код підтвердження для ${normalizedEmail}: ${code}`)

    const transporter = getMailTransporter()
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@uzhnu.edu.ua',
          to: normalizedEmail,
          subject: 'Код скидання пароля — УжУ Cars',
          html: `<p>Ваш одноразовий код для зміни пароля: <strong>${code}</strong></p><p>Дійсний протягом 10 хвилин.</p>`,
        })
        return res.json({
          message: 'Код підтвердження успішно надіслано на вашу пошту!',
        })
      } catch (mailError) {
        console.warn('[Mail Warning] Не вдалося надіслати лист через SMTP:', mailError.message)
        return res.json({
          message: 'Код сформовано (дивіться у консолі розробника або підказці нижче)',
          devCode: code,
        })
      }
    }

    // Якщо SMTP не налаштований — повертаємо devCode для зручності
    return res.json({
      message: 'Код підтвердження згенеровано',
      devCode: code,
    })
  } catch (error) {
    console.error('[Forgot Password Error]:', error)
    return res.status(500).json({ error: 'Помилка при створенні запиту на скидання пароля' })
  }
})

/**
 * POST /api/auth/reset-password
 * Підтвердження коду та збереження нового пароля
 */
authRouter.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Введіть адресу електронної пошти' })
    }

    if (!code || code.trim().length !== 6) {
      return res.status(400).json({ error: 'Введіть коректний 6-значний код' })
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Новий пароль повинен містити щонайменше 6 символів' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const cleanCode = code.trim()

    // Перевірка коду та терміну дії
    const [rows] = await pool.query(
      'SELECT email FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()',
      [normalizedEmail, cleanCode],
    )

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Недійсний або прострочений код підтвердження' })
    }

    // Хешування нового пароля
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Оновлення пароля в таблиці users
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [
      passwordHash,
      normalizedEmail,
    ])

    // Видаляємо використаний код
    await pool.query('DELETE FROM password_resets WHERE email = ?', [normalizedEmail])

    console.log(`[Password Reset] Пароль для ${normalizedEmail} успішно змінено.`)

    return res.json({
      message: 'Пароль успішно змінено! Тепер ви можете увійти до системи.',
    })
  } catch (error) {
    console.error('[Reset Password Error]:', error)
    return res.status(500).json({ error: 'Помилка при оновленні пароля' })
  }
})
