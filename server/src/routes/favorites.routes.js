import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

export const favoritesRouter = Router()

/**
 * GET /api/favorites
 * Отримання списку ID обраних авто поточного користувача
 */
favoritesRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const [rows] = await pool.query('SELECT car_id FROM user_favorites WHERE user_id = ?', [userId])
    const favoriteIds = rows.map((r) => Number(r.car_id))
    return res.json(favoriteIds)
  } catch (error) {
    console.error('[Favorites Get Error]:', error)
    return res.status(500).json({ error: 'Помилка отримання списку обраних авто' })
  }
})

/**
 * POST /api/favorites/:carId/toggle
 * Додавання або видалення авто з обраного
 */
favoritesRouter.post('/:carId/toggle', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const carId = Number(req.params.carId)

    if (!carId || isNaN(carId)) {
      return res.status(400).json({ error: 'Некоректний ID автомобіля' })
    }

    const [existing] = await pool.query(
      'SELECT 1 FROM user_favorites WHERE user_id = ? AND car_id = ?',
      [userId, carId],
    )

    let isFavorite = false
    if (existing.length > 0) {
      await pool.query('DELETE FROM user_favorites WHERE user_id = ? AND car_id = ?', [
        userId,
        carId,
      ])
      isFavorite = false
    } else {
      await pool.query('INSERT INTO user_favorites (user_id, car_id) VALUES (?, ?)', [
        userId,
        carId,
      ])
      isFavorite = true
    }

    const [allRows] = await pool.query('SELECT car_id FROM user_favorites WHERE user_id = ?', [
      userId,
    ])
    const updatedFavorites = allRows.map((r) => Number(r.car_id))

    return res.json({
      favorites: updatedFavorites,
      isFavorite,
    })
  } catch (error) {
    console.error('[Favorites Toggle Error]:', error)
    return res.status(500).json({ error: 'Помилка зміни стану обраного' })
  }
})
