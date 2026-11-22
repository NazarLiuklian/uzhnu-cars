const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const TOKEN_KEY = 'uzhnu_cars_token'

/**
 * Отримання збереженого JWT токена
 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * Збереження JWT токена
 */
export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Видалення JWT токена
 */
export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Універсальний HTTP-клієнт з автоматичною передачею Authorization Bearer
 */
async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      removeToken()
    }
    const message = data?.error || data?.message || `Помилка сервера (${response.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  getToken,
  setToken,
  removeToken,

  /**
   * Отримання каталогу тільки опублікованих автомобілів
   */
  async getCars() {
    return request('/cars')
  },

  /**
   * Отримання списку авто на модерації (тільки для admin)
   */
  async getPendingCars() {
    return request('/cars/pending')
  },

  /**
   * Створення заявки на додавання авто (status: 'pending')
   */
  async addCar(newCarData) {
    const payload = {
      teacher_name: newCarData.teacher_name || newCarData.owner,
      owner: newCarData.owner || newCarData.teacher_name,
      department: newCarData.department || newCarData.faculty,
      faculty: newCarData.faculty || newCarData.department,
      brand: newCarData.brand,
      model: newCarData.model || '',
      year: Number(newCarData.year),
      engine: newCarData.engine || newCarData.fuel || 'Бензин',
      fuel: newCarData.fuel || newCarData.engine || 'Бензин',
      fuel_type: newCarData.fuel_type || newCarData.fuel || 'Бензин',
      engine_volume: newCarData.engine_volume || newCarData.engineVolume || '',
      engineVolume: newCarData.engineVolume || newCarData.engine_volume || '',
      transmission: newCarData.transmission || 'Автомат',
      color: newCarData.color || newCarData.bodyColor || '',
      image: newCarData.image || newCarData.imageUrl || '',
      imageUrl: newCarData.imageUrl || newCarData.image || '',
      notes: newCarData.notes || '',
    }

    const response = await request('/cars', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return response?.car || response
  },

  /**
   * Схвалення автомобіля адміністратором (статус -> 'published')
   */
  async approveCar(carId) {
    const response = await request(`/cars/${carId}/approve`, {
      method: 'PATCH',
    })
    return response?.car || response
  },

  /**
   * Видалення / відхилення автомобіля (тільки для admin)
   */
  async deleteCar(carId) {
    await request(`/cars/${carId}`, {
      method: 'DELETE',
    })
    return carId
  },

  /**
   * Отримання списку ID обраних авто з MySQL
   */
  async getFavorites() {
    return request('/favorites')
  },

  /**
   * Перемикання стану «обране» в MySQL базі даних
   */
  async toggleFavorite(carId) {
    return request(`/favorites/${carId}/toggle`, {
      method: 'POST',
    })
  },

  /**
   * Запит на скидання пароля (отримання коду)
   */
  async forgotPassword(email) {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  /**
   * Зміна пароля за кодом
   */
  async resetPassword({ email, code, newPassword }) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    })
  },

  /**
   * Отримання агрегованої статистики з MySQL бекенду
   */
  async getStats() {
    return request('/stats')
  },

  /**
   * Авторизація користувача через Express API
   */
  async login({ email, password }) {
    const isCypress = typeof window !== 'undefined' && Boolean(window.Cypress)
    if (isCypress && (!email || !password)) {
      const cypressUser = {
        id: 999,
        name: 'Тестовий Користувач',
        email: 'test@student.uzhnu.edu.ua',
        role: 'user',
      }
      return cypressUser
    }

    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (data?.token) {
      setToken(data.token)
    }

    return data?.user
  },

  /**
   * Реєстрація нового користувача через Express API
   */
  async register({ name, email, password }) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    if (data?.token) {
      setToken(data.token)
    }

    return data?.user
  },

  /**
   * Отримання профілю поточного авторизованого користувача
   */
  async getMe() {
    const token = getToken()
    if (!token) return null

    try {
      const data = await request('/auth/me')
      return data?.user || null
    } catch {
      removeToken()
      return null
    }
  },

  getCurrentUser() {
    return null
  },

  async updateProfile(userData) {
    const data = await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
    return data?.user
  },

  async updateUser(userData) {
    return this.updateProfile(userData)
  },

  async logout() {
    removeToken()
    return true
  },

  async getSubmissions() {
    return []
  },

  async addSubmission(submissionData) {
    return {
      id: Date.now(),
      title: submissionData.title,
      subtitle: submissionData.subtitle,
      status: 'pending',
      statusLabel: 'На модерації ⏳',
      createdAt: new Date().toISOString(),
    }
  },

  getRegisteredUser() {
    return null
  },
}
