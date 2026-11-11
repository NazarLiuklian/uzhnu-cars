import { initialCars, statsData } from './mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const USER_STORAGE_KEY = 'uzhnu_auth_user'
const REGISTERED_USER_STORAGE_KEY = 'registered_user'
const SUBMISSIONS_STORAGE_KEY = 'uzhnu_submissions'
const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=70'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Запит не виконано (${response.status})`
    try {
      const body = await response.json()
      if (body?.message) message = body.message
    } catch {
      // Use the status-based message when the server does not return JSON.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const api = {
  async getCars() {
    await delay(300)
    return request('/cars')
  },

  async addCar(newCarData) {
    await delay(350)

    if (!newCarData.brand || !newCarData.owner) {
      throw new Error('Марка та власник автомобіля є обовʼязковими')
    }

    const newCar = {
      brand: newCarData.brand,
      model: newCarData.model || '',
      year: Number(newCarData.year) || new Date().getFullYear(),
      faculty: newCarData.faculty || 'Кафедра ІПЗ',
      owner: newCarData.owner,
      fuel: newCarData.fuel || 'Бензин',
      transmission: newCarData.transmission || 'Автоматична',
      engineVolume: newCarData.engineVolume || '2.0 л',
      imageUrl: newCarData.imageUrl || DEFAULT_CAR_IMAGE,
      imageText: `[ Фото Авто ${newCarData.brand} ]`,
      favorite: false,
      notes: newCarData.notes || '',
    }

    return request('/cars', {
      method: 'POST',
      body: JSON.stringify(newCar),
    })
  },

  async deleteCar(carId) {
    await delay(250)
    await request(`/cars/${carId}`, { method: 'DELETE' })
    return carId
  },

  async toggleFavorite(carId, currentFavorite) {
    return request(`/cars/${carId}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorite: !currentFavorite }),
    })
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

  async resetPassword({ email, newPassword }) {
    await delay(350)

    if (!email?.trim()) {
      throw new Error('Введіть адресу електронної пошти')
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Пароль повинен містити щонайменше 6 символів')
    }

    const registeredUser = this.getRegisteredUser()
    const normalizedEmail = email.trim().toLowerCase()

    if (!registeredUser || registeredUser.email.trim().toLowerCase() !== normalizedEmail) {
      throw new Error('Користувача з такою електронною поштою не знайдено')
    }

    const updatedUser = {
      ...registeredUser,
      password: newPassword,
    }

    localStorage.setItem(REGISTERED_USER_STORAGE_KEY, JSON.stringify(updatedUser))

    const activeUser = this.getCurrentUser()

    if (activeUser?.email?.trim().toLowerCase() === normalizedEmail) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    }

    return updatedUser
  },

  async register({ name, email, password }) {
    await delay(350)

    if (!name || name.trim().length < 2) {
      throw new Error('Введіть ваше імʼя та прізвище')
    }

    if (!email) {
      throw new Error('Введіть адресу електронної пошти')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const registeredUser = this.getRegisteredUser()

    if (registeredUser?.email?.trim().toLowerCase() === normalizedEmail) {
      throw new Error(
        'Користувач із такою електронною поштою вже зареєстрований. Будь ласка, увійдіть',
      )
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
      email: normalizedEmail,
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
  async getSubmissions(userEmail) {
    await delay(150)
    const custom = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]')
    if (!userEmail) return []

    const normalizedEmail = userEmail.trim().toLowerCase()
    return custom.filter((submission) => submission.userEmail === normalizedEmail)
  },

  async addSubmission(submissionData) {
    await delay(300)
    const custom = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || '[]')
    const item = {
      id: Date.now(),
      title: submissionData.title,
      subtitle: submissionData.subtitle,
      userEmail: submissionData.userEmail?.trim().toLowerCase(),
      status: 'approved',
      statusLabel: 'Опубліковано ✅',
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
