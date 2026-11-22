-- ==============================================================
-- Схема бази даних MySQL: uzhnu_cars_db
-- Лабораторна робота №7: Бекенд частина
-- ==============================================================

-- 1. Створення бази даних
CREATE DATABASE IF NOT EXISTS `uzhnu_cars_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `uzhnu_cars_db`;

-- 2. Таблиця користувачів
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) DEFAULT '',
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `avatar` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Таблиця автомобілів
CREATE TABLE IF NOT EXISTS `cars` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `teacher_name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `year` INT NOT NULL,
  `engine` VARCHAR(100),
  `fuel_type` VARCHAR(50) DEFAULT 'Бензин',
  `engine_volume` VARCHAR(100) DEFAULT '',
  `transmission` VARCHAR(50) DEFAULT 'Автомат',
  `color` VARCHAR(50),
  `notes` TEXT,
  `image` LONGTEXT,
  `status` ENUM('pending', 'published') DEFAULT 'pending',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cars_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Таблиця улюблених автомобілів користувачів
CREATE TABLE IF NOT EXISTS `user_favorites` (
  `user_id` INT NOT NULL,
  `car_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `car_id`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_car` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Таблиця кодів скидання пароля
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` VARCHAR(255) PRIMARY KEY,
  `code` VARCHAR(6) NOT NULL,
  `expires_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Початкове наповнення: користувачі
-- Пароль адміністратора: admin123
-- Пароль студента: student123
INSERT INTO `users` (`name`, `last_name`, `email`, `password_hash`, `role`, `avatar`)
VALUES
  ('Назар', 'Люклян', 'nazar.liuklian@student.uzhnu.edu.ua', '$2a$10$iGgQ5yJ0P9H1l7oA7vJk3.1p0wB5pDvZ0Qv1tPzRjYnZk4xN3sTae', 'admin', ''),
  ('Тестовий', 'Студент', 'student@student.uzhnu.edu.ua', '$2a$10$wB5pDvZ0Qv1tPzRjYnZk4.1p0wB5pDvZ0Qv1tPzRjYnZk4xN3sTae', 'user', '')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 7. Початкове наповнення: опубліковані автомобілі викладачів УжНУ
INSERT INTO `cars` (`teacher_name`, `department`, `brand`, `model`, `year`, `engine`, `fuel_type`, `engine_volume`, `transmission`, `color`, `notes`, `image`, `status`, `created_by`)
VALUES
  (
    'Бучук Р. Ю.',
    'Кафедра ІПЗ',
    'BMW',
    '3 Series',
    2019,
    'Бензин',
    'Бензин',
    '2.0 л',
    'Автомат',
    'Чорний',
    '',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg/1280px-2019_BMW_318d_SE_Automatic_2.0_Front.jpg',
    'published',
    1
  ),
  (
    'Білак Ю. Ю.',
    'Кафедра ІСТ',
    'Audi',
    'A6',
    2018,
    'Дизель',
    'Дизель',
    '3.0 л',
    'Автомат',
    'Чорний',
    '',
    'https://media.ed.edmunds-media.com/audi/a6/2018/oem/2018_audi_a6_sedan_30-tfsi-prestige-quattro_fq_oem_2_1600.jpg',
    'published',
    1
  ),
  (
    'Сегін І. М.',
    'Кафедра ІПЗ',
    'Volkswagen',
    'Passat B8',
    2017,
    'Дизель',
    'Дизель',
    '2.0 л',
    'Автомат',
    'Сірий',
    '',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/VW_Passat_B8_Limousine_2.0_TDI_Highline.JPG',
    'published',
    1
  ),
  (
    'Мельник О. О.',
    'Кафедра ІПЗ',
    'Nissan',
    'Leaf',
    2021,
    'Електро',
    'Електро',
    '62 кВт',
    'Автомат',
    'Білий',
    '',
    'https://wieck-nissanao-production.s3.us-west-1.amazonaws.com/releaseInlineImages/67c8675762e75f9327220cb00aba8abd59fc9db3',
    'published',
    1
  );
