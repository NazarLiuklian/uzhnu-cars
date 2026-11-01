import { initialCars, initialSubmissions, statsData } from './mockData'

const CARS_STORAGE_KEY = 'uzhnu_cars_custom'
const USER_STORAGE_KEY = 'uzhnu_auth_user'
const SUBMISSIONS_STORAGE_KEY = 'uzhnu_submissions'
const FAVORITES_STORAGE_KEY = 'uzhnu_favorites'

// Helper for simulated network delay
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  /**
   * Fetch cars using fetch API with simulated latency and local storage synchronization
   */
  async getCars() {
    await delay(350)

    let baseCars = []
    try {
      const response = await fetch('/cars.json')
      if (response.ok) {
        baseCars = await response.json()
      } else {
        baseCars = initialCars
      }
    } catch {
      // Graceful fallback for offline / test runner environments
      baseCars = initialCars
    }

    // Merge with custom added cars from localStorage
    const customCars = JSON.parse(localStorage.getItem(CARS_STORAGE_KEY) || '[]')
    const allCars = [...baseCars, ...customCars]

    // Apply persisted favorite state
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}')
    return allCars.map((car) => ({
      ...car,
      favorite: favorites[car.id] !== undefined ? favorites[car.id] : Boolean(car.favorite),
    }))
  },

  /**
   * Add a new car into the mock backend
   */
  async addCar(newCarData) {
    await delay(400)

    if (!newCarData.brand || !newCarData.owner) {
      throw new Error('Марка та власник автомобіля є обовʼязковими')
    }

    const customCars = JSON.parse(localStorage.getItem(CARS_STORAGE_KEY) || '[]')
    const newCar = {
      id: Date.now(),
      brand: newCarData.brand,
      model: newCarData.model || '',
      year: Number(newCarData.year) || new Date().getFullYear(),
      faculty: newCarData.faculty || 'Кафедра ІПЗ',
      owner: newCarData.owner,
      fuel: newCarData.fuel || 'Бензин',
      transmission: newCarData.transmission || 'Автоматична',
      engineVolume: newCarData.engineVolume || '2.0 л',
      imageText: `[ Фото Авто ${newCarData.brand} ]`,
      favorite: false,
      notes: newCarData.notes || '',
    }

    customCars.unshift(newCar)
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(customCars))
    return newCar
  },

  /**
   * Toggle favorite state of a car
   */
  async toggleFavorite(carId, currentFavorite) {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}')
    favorites[carId] = !currentFavorite
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    return !currentFavorite
  },

  /**
   * Authentication mock methods
   */
  async login({ email, password }) {
    await delay(450)

    if (!email) {
      throw new Error('Введіть адресу електронної пошти')
    }
    if (!password) {
      throw new Error('Введіть пароль')
    }
    if (password.length < 6) {
      throw new Error('Пароль повинен містити щонайменше 6 символів')
    }

    // Extract name from email or set default
    const namePart = email.split('@')[0].replace('.', ' ')
    const capitalizedName = namePart
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')

    const user = {
      name: capitalizedName || 'Назар Люклян',
      email,
      avatar: 'НЛ',
      role: 'student',
      faculty: 'Кафедра ІПЗ',
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  async register({ name, email, password }) {
    await delay(450)

    if (!name || name.trim().length < 2) {
      throw new Error('Введіть ваше імʼя та прізвище')
    }
    if (!email) {
      throw new Error('Введіть адресу електронної пошти')
    }
    if (!password || password.length < 6) {
      throw new Error('Пароль повинен містити щонайменше 6 символів')
    }

    const parts = name.trim().split(' ')
    const avatar =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.trim().slice(0, 2).toUpperCase()

    const user = {
      name: name.trim(),
      email: email.trim(),
      avatar,
      role: 'student',
      faculty: 'Кафедра ІПЗ',
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  async logout() {
    await delay(150)
    localStorage.removeItem(USER_STORAGE_KEY)
    return true
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  async updateUser(userData) {
    await delay(300)
    const currentUser = this.getCurrentUser() || {}
    const updated = { ...currentUser, ...userData }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
    return updated
  },

  /**
   * Submissions history
   */
  async getSubmissions() {
    await delay(200)
    const custom = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]')
    return [...custom, ...initialSubmissions]
  },

  async addSubmission(submissionData) {
    await delay(350)
    const custom = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]')
    const item = {
      id: Date.now(),
      title: submissionData.title,
      subtitle: submissionData.subtitle,
      status: 'pending',
      statusLabel: 'На модерації ⏳',
      createdAt: new Date().toISOString(),
    }
    custom.unshift(item)
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(custom))
    return item
  },

  /**
   * Fetch or compute stats
   */
  async getStats() {
    await delay(250)
    return statsData
  },
}
