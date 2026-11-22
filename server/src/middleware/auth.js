import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { pool } from '../db.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'uzhnu_cars_super_secret_jwt_key_2026'

/**
 * Middleware для перевірки валідності JWT-токена
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Авторизація обовʼязкова. Токен відсутній.',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'Недійсний або прострочений токен авторизації.',
    })
  }
}

/**
 * Middleware для перевірки ролі адміністратора (role === 'admin')
 */
export async function adminMiddleware(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(403).json({
        error: 'Доступ заборонено. Потрібні права адміністратора.',
      })
    }

    const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id])
    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({
        error: 'Доступ заборонено. Потрібні права адміністратора.',
      })
    }

    req.user.role = 'admin'
    next()
  } catch (error) {
    console.error('[Admin Middleware Error]:', error)
    return res.status(500).json({
      error: 'Не вдалося перевірити права адміністратора.',
    })
  }
}
