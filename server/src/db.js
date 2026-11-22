import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'uzhnu_cars_db',
} = process.env

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

/**
 * Безпечне додавання стовпця до таблиці, якщо він відсутній
 */
async function addColumnIfNotExists(tableName, columnName, columnDefinition) {
  try {
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [DB_NAME, tableName, columnName],
    )
    if (cols.length === 0) {
      await pool.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition}`,
      )
      console.log(`[Database] Додано стовпець ${columnName} до таблиці ${tableName}`)
    }
  } catch (err) {
    console.warn(`[Database Warning] Перевірка стовпця ${columnName}:`, err.message)
  }
}

/**
 * Автоматична ініціалізація бази даних, таблиць та початкових даних
 */
export async function initDb() {
  let bootstrapConnection
  try {
    // 1. Перевірка або створення самої бази даних
    bootstrapConnection = await mysql.createConnection({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    })

    await bootstrapConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    )
    console.log(`[Database] База даних '${DB_NAME}' перевірена/створена успішно.`)
  } catch (error) {
    console.warn(`[Database Warning] Не вдалося створити БД автоматично: ${error.message}`)
  } finally {
    if (bootstrapConnection) {
      await bootstrapConnection.end()
    }
  }

  // 2. Створення таблиць
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        last_name VARCHAR(150) DEFAULT '',
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        avatar LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    await addColumnIfNotExists('users', 'last_name', "VARCHAR(150) DEFAULT ''")
    await addColumnIfNotExists('users', 'avatar', 'LONGTEXT')

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_name VARCHAR(150) NOT NULL,
        department VARCHAR(150) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        engine VARCHAR(100),
        fuel_type VARCHAR(50) DEFAULT 'Бензин',
        engine_volume VARCHAR(100) DEFAULT '',
        transmission VARCHAR(50) DEFAULT 'Автомат',
        color VARCHAR(50),
        notes TEXT,
        image LONGTEXT,
        status ENUM('pending', 'published') DEFAULT 'pending',
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_cars_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // Додаємо нові стовпці до cars, якщо таблиця була створена раніше
    await addColumnIfNotExists('cars', 'fuel_type', "VARCHAR(50) DEFAULT 'Бензин'")
    await addColumnIfNotExists('cars', 'engine_volume', "VARCHAR(100) DEFAULT ''")
    await addColumnIfNotExists('cars', 'transmission', "VARCHAR(50) DEFAULT 'Автомат'")
    await addColumnIfNotExists('cars', 'notes', 'TEXT')

    // 3. Таблиця улюблених автомобілів
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        user_id INT NOT NULL,
        car_id INT NOT NULL,
        PRIMARY KEY (user_id, car_id),
        CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_fav_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    // 4. Таблиця кодів скидання пароля
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        email VARCHAR(255) PRIMARY KEY,
        code VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    console.log(
      '[Database] Таблиці users, cars, user_favorites, password_resets перевірені/створені успішно.',
    )

    // 5. Seed: Адміністратор
    const [existingAdmin] = await pool.query('SELECT id FROM users WHERE email = ?', [
      'nazar.liuklian@student.uzhnu.edu.ua',
    ])

    let adminId = existingAdmin?.[0]?.id

    if (!adminId) {
      const adminHash = await bcrypt.hash('admin123', 10)
      const [res] = await pool.query(
        'INSERT INTO users (name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['Назар', 'Люклян', 'nazar.liuklian@student.uzhnu.edu.ua', adminHash, 'admin'],
      )
      adminId = res.insertId
      console.log('[Database] Створено адміністратора: nazar.liuklian@student.uzhnu.edu.ua')
    }

    // 6. Seed: Демо-користувач
    const [existingStudent] = await pool.query('SELECT id FROM users WHERE email = ?', [
      'student@student.uzhnu.edu.ua',
    ])

    if (existingStudent.length === 0) {
      const studentHash = await bcrypt.hash('student123', 10)
      await pool.query(
        'INSERT INTO users (name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['Тестовий', 'Студент', 'student@student.uzhnu.edu.ua', studentHash, 'user'],
      )
      console.log('[Database] Створено демо-студента: student@student.uzhnu.edu.ua')
    }

    // 7. Seed: Початкові автомобілі зі статусом 'published'
    const initialCars = [
      {
        teacher_name: 'Бучук Р. Ю.',
        department: 'Кафедра ІПЗ',
        brand: 'BMW',
        model: '3 Series',
        year: 2019,
        engine: 'Бензин',
        fuel_type: 'Бензин',
        engine_volume: '2.0 л',
        transmission: 'Автомат',
        color: 'Чорний',
        notes: '',
        image:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg/1280px-2019_BMW_318d_SE_Automatic_2.0_Front.jpg',
        status: 'published',
        created_by: adminId || null,
      },
      {
        teacher_name: 'Білак Ю. Ю.',
        department: 'Кафедра ІСТ',
        brand: 'Audi',
        model: 'A6',
        year: 2018,
        engine: 'Дизель',
        fuel_type: 'Дизель',
        engine_volume: '3.0 л',
        transmission: 'Автомат',
        color: 'Чорний',
        notes: '',
        image:
          'https://media.ed.edmunds-media.com/audi/a6/2018/oem/2018_audi_a6_sedan_30-tfsi-prestige-quattro_fq_oem_2_1600.jpg',
        status: 'published',
        created_by: adminId || null,
      },
      {
        teacher_name: 'Сегін І. М.',
        department: 'Кафедра ІПЗ',
        brand: 'Volkswagen',
        model: 'Passat B8',
        year: 2017,
        engine: 'Дизель',
        fuel_type: 'Дизель',
        engine_volume: '2.0 л',
        transmission: 'Автомат',
        color: 'Сірий',
        notes: '',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/9/91/VW_Passat_B8_Limousine_2.0_TDI_Highline.JPG',
        status: 'published',
        created_by: adminId || null,
      },
      {
        teacher_name: 'Мельник О. О.',
        department: 'Кафедра ІПЗ',
        brand: 'Nissan',
        model: 'Leaf',
        year: 2021,
        engine: 'Електро',
        fuel_type: 'Електро',
        engine_volume: '62 кВт',
        transmission: 'Автомат',
        color: 'Білий',
        notes: '',
        image:
          'https://wieck-nissanao-production.s3.us-west-1.amazonaws.com/releaseInlineImages/67c8675762e75f9327220cb00aba8abd59fc9db3',
        status: 'published',
        created_by: adminId || null,
      },
    ]

    const [carsCount] = await pool.query('SELECT COUNT(*) as count FROM cars')
    if (carsCount[0].count === 0) {
      for (const car of initialCars) {
        await pool.query(
          `INSERT INTO cars (teacher_name, department, brand, model, year, engine, fuel_type, engine_volume, transmission, color, notes, image, status, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            car.teacher_name,
            car.department,
            car.brand,
            car.model,
            car.year,
            car.engine,
            car.fuel_type,
            car.engine_volume,
            car.transmission,
            car.color,
            car.notes,
            car.image,
            car.status,
            car.created_by,
          ],
        )
      }
      console.log('[Database] Початкові автомобілі успішно завантажено в MySQL.')
    } else {
      for (const car of initialCars) {
        await pool.query(
          `UPDATE cars SET 
             engine = ?, 
             fuel_type = ?, 
             engine_volume = ?, 
             transmission = ?, 
             notes = ''
           WHERE brand = ? AND model = ? AND (engine LIKE '%к.с.%' OR engine_volume IS NULL OR engine_volume = '')`,
          [car.engine, car.fuel_type, car.engine_volume, car.transmission, car.brand, car.model],
        )
      }
    }
  } catch (error) {
    console.error(`[Database Error] Помилка ініціалізації таблиць: ${error.message}`)
  }
}
