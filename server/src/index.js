import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb } from './db.js'
import { authRouter } from './routes/auth.routes.js'
import { carsRouter } from './routes/cars.routes.js'
import { statsRouter } from './routes/stats.routes.js'
import { favoritesRouter } from './routes/favorites.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
)

// Підтримка великих JSON-корисних навантажень для base64 зображень
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Логування запитів
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Базовий ендпоінт перевірки працездатності
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Маршрутизація
app.use('/api/auth', authRouter)
app.use('/api/cars', carsRouter)
app.use('/api/stats', statsRouter)
app.use('/api/favorites', favoritesRouter)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.originalUrl} не знайдено` })
})

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('[Server Error]:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Внутрішня помилка сервера',
  })
})

// Ініціалізація БД та запуск сервера
async function startServer() {
  try {
    await initDb()
  } catch (error) {
    console.error('[Startup Warning] Помилка під час ініціалізації БД:', error.message)
  }

  app.listen(PORT, () => {
    console.log(`===============================================`)
    console.log(`🚀 UzhNU Cars API Server запущено на порту ${PORT}`)
    console.log(`📡 URL: http://localhost:${PORT}`)
    console.log(`===============================================`)
  })
}

startServer()
