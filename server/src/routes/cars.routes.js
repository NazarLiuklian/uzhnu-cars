import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

export const carsRouter = Router()

/**
 * Очищення рядка від кінських сил (к.с.)
 */
function cleanHorsepower(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/,\s*\d+\s*к\.с\.?/gi, '')
    .replace(/\(\s*\d+\s*к\.с\.?\s*\)/gi, '')
    .replace(/\d+\s*к\.с\.?/gi, '')
    .trim()
}

/**
 * Допоміжна функція форматування авто для фронтенду
 */
function formatCarRecord(row) {
  const rawFuel = row.fuel_type || row.engine || 'Бензин'
  const cleanFuel = cleanHorsepower(rawFuel.replace(/\s*\(.*?\)/g, '')).trim() || 'Бензин'

  let cleanVolume = (row.engine_volume || '').trim()
  if (!cleanVolume && row.engine && row.engine.includes('(')) {
    const match = row.engine.match(/\(([^,)]+)/)
    if (match) cleanVolume = match[1].trim()
  }
  cleanVolume = cleanHorsepower(cleanVolume)

  return {
    id: row.id,
    teacher_name: row.teacher_name,
    owner: row.teacher_name, // Сумісність з фронтендом
    department: row.department,
    faculty: row.department, // Сумісність з фільтрами
    brand: row.brand,
    model: row.model,
    year: Number(row.year),
    engine: cleanFuel,
    fuel: cleanFuel, // Чистий тип палива без к.с.
    fuel_type: cleanFuel,
    engine_volume: cleanVolume,
    engineVolume: cleanVolume, // Чистий об'єм/батарея без к.с.
    transmission: row.transmission || 'Автомат',
    color: row.color || '',
    notes: (row.notes || '').trim(),
    image: row.image || '',
    imageUrl: row.image || '', // Сумісність з CarCard
    status: row.status,
    created_by: row.created_by,
    author_name: row.author_name || null,
    author_email: row.author_email || null,
    created_at: row.created_at,
    favorite: false,
  }
}

/**
 * GET /api/cars
 * Публічний список тільки опублікованих автомобілів
 */
carsRouter.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS author_name, u.email AS author_email
      FROM cars c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.status = 'published'
      ORDER BY c.created_at DESC, c.id DESC
    `)

    const cars = rows.map(formatCarRecord)
    return res.json(cars)
  } catch (error) {
    console.error('[Get Cars Error]:', error)
    return res.status(500).json({ error: 'Не вдалося завантажити автомобілі' })
  }
})

/**
 * GET /api/cars/my
 * Захищений список усіх автомобілів поточного користувача
 */
carsRouter.get('/my', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT c.*, u.name AS author_name, u.email AS author_email
      FROM cars c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.created_by = ?
      ORDER BY c.created_at DESC, c.id DESC
    `,
      [req.user.id],
    )

    return res.json(rows.map(formatCarRecord))
  } catch (error) {
    console.error('[Get My Cars Error]:', error)
    return res.status(500).json({ error: 'Не вдалося отримати історію ваших пропозицій' })
  }
})

/**
 * GET /api/cars/pending
 * Захищений маршрут тільки для admin: список авто на модерації
 */
carsRouter.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.name AS author_name, u.email AS author_email
      FROM cars c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC, c.id DESC
    `)

    const pendingCars = rows.map(formatCarRecord)
    return res.json(pendingCars)
  } catch (error) {
    console.error('[Get Pending Cars Error]:', error)
    return res.status(500).json({ error: 'Не вдалося отримати список заявок на модерацію' })
  }
})

/**
 * POST /api/cars
 * Захищений маршрут для авторизованих користувачів: створення заявки на авто (status: 'pending')
 */
carsRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      teacher_name,
      owner,
      department,
      faculty,
      brand,
      model,
      year,
      engine,
      fuel,
      fuel_type,
      engine_volume,
      engineVolume,
      transmission,
      color,
      bodyColor,
      notes,
      image,
      imageUrl,
    } = req.body

    const finalTeacherName = (teacher_name || owner || '').trim()
    const finalDepartment = (department || faculty || '').trim()
    const finalBrand = (brand || '').trim()
    const finalModel = (model || '').trim()
    const finalYear = Number(year)
    const rawFuel = (fuel_type || fuel || engine || 'Бензин').trim()
    const finalFuelType = cleanHorsepower(rawFuel.replace(/\s*\(.*?\)/g, '')).trim() || 'Бензин'
    const finalEngineVolume = cleanHorsepower(engine_volume || engineVolume || '').trim()
    const finalTransmission = (transmission || 'Автомат').trim()
    const finalColor = (color || bodyColor || '').trim()
    const finalNotes = (notes || '').trim()
    const finalImage = image || imageUrl || ''

    if (!finalTeacherName) {
      return res.status(400).json({ error: 'ПІБ викладача є обовʼязковим полем' })
    }

    if (!finalDepartment) {
      return res.status(400).json({ error: 'Кафедра або підрозділ є обовʼязковим полем' })
    }

    if (!finalBrand || !finalModel) {
      return res.status(400).json({ error: 'Марка та модель автомобіля є обовʼязковими' })
    }

    if (!finalYear || isNaN(finalYear) || finalYear < 1970 || finalYear > 2030) {
      return res.status(400).json({ error: 'Вкажіть коректний рік випуску автомобіля' })
    }

    if (!finalEngineVolume) {
      return res.status(400).json({ error: 'Обʼєм двигуна або батарея є обовʼязковим полем' })
    }

    if (!finalColor) {
      return res.status(400).json({ error: 'Колір кузова є обовʼязковим полем' })
    }

    if (!finalImage) {
      return res.status(400).json({ error: 'Фотографія автомобіля є обовʼязковою' })
    }

    const createdBy = req.user.id

    // Запис у базу зі статусом 'pending'
    const [result] = await pool.query(
      `INSERT INTO cars (
        teacher_name, department, brand, model, year, 
        engine, fuel_type, engine_volume, transmission, 
        color, notes, image, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        finalTeacherName,
        finalDepartment,
        finalBrand,
        finalModel,
        finalYear,
        finalFuelType,
        finalFuelType,
        finalEngineVolume,
        finalTransmission,
        finalColor,
        finalNotes,
        finalImage,
        createdBy,
      ],
    )

    const newCarId = result.insertId

    const [createdRows] = await pool.query(
      `SELECT c.*, u.name AS author_name, u.email AS author_email
       FROM cars c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = ?`,
      [newCarId],
    )

    const createdCar = formatCarRecord(createdRows[0])

    return res.status(201).json({
      message: 'Заявку відправлено на модерацію адміністратору',
      car: createdCar,
    })
  } catch (error) {
    console.error('[Create Car Error]:', error)
    return res.status(500).json({ error: 'Внутрішня помилка сервера при додаванні авто' })
  }
})

/**
 * PATCH /api/cars/:id/approve
 * Захищений маршрут тільки для admin: схвалення авто (переведення в status: 'published')
 */
carsRouter.patch('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const carId = Number(req.params.id)

    const [existing] = await pool.query('SELECT * FROM cars WHERE id = ?', [carId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Автомобіль не знайдено' })
    }

    await pool.query("UPDATE cars SET status = 'published' WHERE id = ?", [carId])

    const [updatedRows] = await pool.query(
      `SELECT c.*, u.name AS author_name, u.email AS author_email
       FROM cars c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = ?`,
      [carId],
    )

    return res.json({
      message: 'Автомобіль успішно опубліковано в каталозі',
      car: formatCarRecord(updatedRows[0]),
    })
  } catch (error) {
    console.error('[Approve Car Error]:', error)
    return res.status(500).json({ error: 'Помилка при схваленні автомобіля' })
  }
})

/**
 * DELETE /api/cars/:id
 * Захищений маршрут тільки для admin: видалення / відхилення авто
 */
carsRouter.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const carId = Number(req.params.id)

    const [existing] = await pool.query('SELECT * FROM cars WHERE id = ?', [carId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Автомобіль не знайдено' })
    }

    await pool.query('DELETE FROM cars WHERE id = ?', [carId])

    return res.json({ message: 'Автомобіль успішно видалено' })
  } catch (error) {
    console.error('[Delete Car Error]:', error)
    return res.status(500).json({ error: 'Помилка при видаленні автомобіля' })
  }
})
