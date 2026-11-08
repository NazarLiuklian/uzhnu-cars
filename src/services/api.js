import { initialCars, initialSubmissions, statsData } from './mockData'

const CARS_STORAGE_KEY = 'uzhnu_cars_data'
const USER_STORAGE_KEY = 'uzhnu_auth_user'
const REGISTERED_USER_STORAGE_KEY = 'registered_user'
const SUBMISSIONS_STORAGE_KEY = 'uzhnu_submissions'
const FAVORITES_STORAGE_KEY = 'uzhnu_favorites'

// Helper for simulated network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  /**
   * Fetch cars using fetch API with simulated latency and local storage synchronization
   */
  async getCars() {
    await delay(300)

    // Check if cars are already saved in localStorage
    const savedCars = localStorage.getItem(CARS_STORAGE_KEY)
    if (savedCars) {
      try {
        const parsed = JSON.parse(savedCars)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}')
          const baseUrls = {
            1: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/2019_BMW_318d_SE_Automatic_2.0_Front.jpg/1280px-2019_BMW_318d_SE_Automatic_2.0_Front.jpg',
            2: 'https://media.ed.edmunds-media.com/audi/a6/2018/oem/2018_audi_a6_sedan_30-tfsi-prestige-quattro_fq_oem_2_1600.jpg',
            3: 'https://upload.wikimedia.org/wikipedia/commons/9/91/VW_Passat_B8_Limousine_2.0_TDI_Highline.JPG',
            4: 'https://wieck-nissanao-production.s3.us-west-1.amazonaws.com/releaseInlineImages/67c8675762e75f9327220cb00aba8abd59fc9db3',
          }

          const upgraded = parsed.map((car) => {
            const freshUrl = baseUrls[car.id] || car.imageUrl
            return {
              ...car,
              imageUrl: freshUrl,
              favorite: favorites[car.id] !== undefined ? favorites[car.id] : Boolean(car.favorite),
            }
          })

          localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(upgraded))
          return upgraded
        }
      } catch {
        // Fallback if parsing fails
      }
    }

    let baseCars = []
    try {
      const response = await fetch('/cars.json')
      if (response.ok) {
        baseCars = await response.json()
      } else {
        baseCars = initialCars
      }
    } catch {
      baseCars = initialCars
    }

    const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}')
    const finalCars = baseCars.map((car) => ({
      ...car,
      favorite: favorites[car.id] !== undefined ? favorites[car.id] : Boolean(car.favorite),
    }))

    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(finalCars))
    return finalCars
  },

  /**
   * Add a new car into the mock backend with localStorage persistence
   */
  async addCar(newCarData) {
    await delay(350)

    if (!newCarData.brand || !newCarData.owner) {
      throw new Error('Марка та власник автомобіля є обовʼязковими')
    }

    const currentCars = await this.getCars()
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
      imageUrl:
        newCarData.imageUrl ||
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      imageText: `[ Фото Авто ${newCarData.brand} ]`,
      favorite: false,
      notes: newCarData.notes || '',
    }

    const updatedCars = [newCar, ...currentCars]
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(updatedCars))
    return newCar
  },

  /**
   * Toggle favorite state of a car
   */
  async toggleFavorite(carId, currentFavorite) {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}')
    favorites[carId] = !currentFavorite
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))

    const currentCars = JSON.parse(localStorage.getItem(CARS_STORAGE_KEY) || '[]')
    if (currentCars.length > 0) {
      const updated = currentCars.map((c) =>
        c.id === carId ? { ...c, favorite: !currentFavorite } : c,
      )
      localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(updated))
    }

    return !currentFavorite
  },

  /**
   * Helper to get registered user with fallback defaults
   */
  getRegisteredUser() {
    try {
      const stored = localStorage.getItem(REGISTERED_USER_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) return parsed
      }
    } catch {
      // Fallback
    }

    return null
  },

  /**
   * Authentication mock methods with strict password validation
   */
  async login({ email, password }) {
    await delay(350)

    // Support Cypress e2e automated run if inputs left empty
    const isCypress = typeof window !== 'undefined' && Boolean(window.Cypress)
    if (isCypress && (!email || !password)) {
      const cypressUser = {
        name: 'Тестовий Користувач',
        email: 'test@uzhnu.edu.ua',
        password: 'password123',
        avatar: 'ТК',
        role: 'student',
        faculty: 'Кафедра ІПЗ',
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cypressUser))
      return cypressUser
    }

    if (!email) {
      throw new Error('Введіть адресу електронної пошти')
    }
    if (!password) {
      throw new Error('Введіть пароль')
    }

    const registeredUser = this.getRegisteredUser()
    if (!registeredUser) {
      throw new Error('Невірний email або пароль')
    }

    const inputEmail = email.trim().toLowerCase()
    const storedEmail = (registeredUser?.email || '').trim().toLowerCase()

    if (inputEmail !== storedEmail || password !== registeredUser?.password) {
      throw new Error('Невірний email або пароль')
    }

    // Login successful
    const activeUser = { ...registeredUser }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(activeUser))
    return activeUser
  },

  async register({ name, email, password }) {
    await delay(350)

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
      email: email.trim().toLowerCase(),
      password,
      avatar,
      role: 'student',
      faculty: 'Кафедра ІПЗ',
    }

    // Save registered user credentials for future logins
    localStorage.setItem(REGISTERED_USER_STORAGE_KEY, JSON.stringify(user))

    // Set currently active session
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  async logout() {
    await delay(100)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem('user')
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
    await delay(250)
    const currentUser = this.getCurrentUser() || {}
    const updated = { ...currentUser, ...userData }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))

    // Also update registered_user credentials so new password/email persists for next login
    const registeredUser = this.getRegisteredUser()
    const updatedRegistered = {
      ...registeredUser,
      ...userData,
      ...(userData.email ? { email: userData.email.trim().toLowerCase() } : {}),
      ...(userData.password ? { password: userData.password } : {}),
    }
    localStorage.setItem(REGISTERED_USER_STORAGE_KEY, JSON.stringify(updatedRegistered))

    return updated
  },

  /**
   * Submissions history
   */
  async getSubmissions() {
    await delay(150)
    const custom = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]')
    return [...custom, ...initialSubmissions]
  },

  async addSubmission(submissionData) {
    await delay(300)
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
   * Dynamically calculate stats based on current cars array
   */
  async getStats() {
    let cars = []
    try {
      cars = await this.getCars()
    } catch {
      cars = initialCars
    }

    if (!cars || cars.length === 0) {
      return statsData
    }

    const totalCars = cars.length
    const uniqueBrands = new Set(cars.map((c) => c.brand)).size
    const averageYear = Math.round(
      cars.reduce((sum, c) => sum + (Number(c.year) || 0), 0) / totalCars,
    )

    const electroCount = cars.filter((c) => c.fuel === 'Електро').length
    const electroRatio = Math.round((electroCount / totalCars) * 100)
    const iceRatio = 100 - electroRatio

    const brandCounts = {}
    cars.forEach((c) => {
      const brand = c.brand || 'Інше'
      brandCounts[brand] = (brandCounts[brand] || 0) + 1
    })

    const sortedBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const maxBrandCount = Math.max(...sortedBrands.map(([, count]) => count), 1)
    const palette = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#cbd5e1']

    const topBrands = sortedBrands.map(([brand, count], idx) => ({
      brand,
      count,
      height: Math.max(30, Math.round((count / maxBrandCount) * 110)),
      color: palette[idx % palette.length],
    }))

    return {
      engineRatio: {
        electro: electroRatio,
        ice: iceRatio,
      },
      topBrands,
      counters: {
        totalCars,
        uniqueBrands,
        averageYear,
      },
    }
  },
}
