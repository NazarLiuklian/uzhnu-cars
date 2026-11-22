import { Router } from 'express'
import { pool } from '../db.js'

export const statsRouter = Router()

/**
 * GET /api/stats
 * Агрегована аналітика автопарку безпосередньо через SQL-запити в MySQL
 */
statsRouter.get('/', async (req, res) => {
  try {
    // 1. Загальна кількість опублікованих авто
    const [totalCarsRows] = await pool.query(
      "SELECT COUNT(*) as count FROM cars WHERE status = 'published'",
    )
    const totalCars = Number(totalCarsRows[0]?.count || 0)

    // 2. Кількість авто в очікуванні модерації (pending)
    const [pendingCarsRows] = await pool.query(
      "SELECT COUNT(*) as count FROM cars WHERE status = 'pending'",
    )
    const pendingCars = Number(pendingCarsRows[0]?.count || 0)

    // 3. Розподіл по марках (GROUP BY brand)
    const [brandsRows] = await pool.query(`
      SELECT brand, COUNT(*) as count
      FROM cars
      WHERE status = 'published'
      GROUP BY brand
      ORDER BY count DESC, brand ASC
    `)

    // 4. Розподіл по кафедрах (GROUP BY department)
    const [deptRows] = await pool.query(`
      SELECT department, COUNT(*) as count
      FROM cars
      WHERE status = 'published'
      GROUP BY department
      ORDER BY count DESC, department ASC
    `)

    // 5. Розподіл за типом палива за 4 основними категоріями (Бензин, Дизель, Електро, Гібрид)
    const [fuelRows] = await pool.query(`
      SELECT 
        CASE 
          WHEN LOWER(COALESCE(fuel_type, engine)) LIKE '%дизель%' THEN 'Дизель'
          WHEN LOWER(COALESCE(fuel_type, engine)) LIKE '%електро%' 
            OR LOWER(COALESCE(fuel_type, engine)) LIKE '%electric%' 
            OR LOWER(COALESCE(fuel_type, engine)) LIKE '%ev%' THEN 'Електро'
          WHEN LOWER(COALESCE(fuel_type, engine)) LIKE '%гібрид%' 
            OR LOWER(COALESCE(fuel_type, engine)) LIKE '%hybrid%' THEN 'Гібрид'
          ELSE 'Бензин'
        END AS fuel_category,
        COUNT(*) as count
      FROM cars
      WHERE status = 'published'
      GROUP BY fuel_category
      ORDER BY count DESC
    `)

    // 6. Середній рік випуску
    const [avgYearRows] = await pool.query(
      "SELECT ROUND(AVG(year)) as avg_year FROM cars WHERE status = 'published'",
    )
    const averageYear = Number(avgYearRows[0]?.avg_year || (totalCars > 0 ? 2019 : 0))

    // 7. Найновіше та найстаріше авто
    const [newestRows] = await pool.query(
      "SELECT brand, model, year, teacher_name FROM cars WHERE status = 'published' ORDER BY year DESC, id DESC LIMIT 1",
    )
    const [oldestRows] = await pool.query(
      "SELECT brand, model, year, teacher_name FROM cars WHERE status = 'published' ORDER BY year ASC, id ASC LIMIT 1",
    )

    // 8. Співвідношення типів двигунів: Електро vs ДВЗ
    const electroItem = fuelRows.find((f) => f.fuel_category === 'Електро')
    const electroCount = Number(electroItem?.count || 0)

    let electroRatio = 0
    let iceRatio = 0
    if (totalCars > 0) {
      electroRatio = Math.round((electroCount / totalCars) * 100)
      iceRatio = 100 - electroRatio
    }

    // Підготовка графіка топ-брендів для UI
    const maxBrandCount = Math.max(...brandsRows.map((b) => Number(b.count)), 1)
    const brandColors = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#cbd5e1', '#94a3b8']

    const topBrands = brandsRows.slice(0, 6).map((b, idx) => ({
      brand: b.brand,
      count: Number(b.count),
      height: Math.max(30, Math.round((Number(b.count) / maxBrandCount) * 110)),
      color: brandColors[idx % brandColors.length],
    }))

    const topDepartments = deptRows.map((d) => ({
      department: d.department,
      count: Number(d.count),
    }))

    const fuelDistribution = fuelRows.map((f) => ({
      fuel: f.fuel_category,
      count: Number(f.count),
    }))

    return res.json({
      engineRatio: {
        electro: electroRatio,
        ice: iceRatio,
      },
      topBrands,
      topDepartments,
      fuelDistribution,
      counters: {
        totalCars,
        pendingCars,
        uniqueBrands: brandsRows.length,
        averageYear,
        newestCar: newestRows[0] || null,
        oldestCar: oldestRows[0] || null,
      },
    })
  } catch (error) {
    console.error('[Get Stats Error]:', error)
    return res.status(500).json({ error: 'Помилка розрахунку статистики автопарку' })
  }
})
