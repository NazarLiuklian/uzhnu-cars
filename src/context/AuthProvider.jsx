import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Перевірка сесії за JWT токеном при старті
  useEffect(() => {
    let isMounted = true
    const checkAuth = async () => {
      try {
        const currentUser = await api.getMe()
        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedUser = await api.login({ email, password })
      setUser(loggedUser)
      return loggedUser
    } catch (err) {
      const message = err.message || 'Помилка авторизації'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await api.register({ name, email, password })
      setUser(newUser)
      return newUser
    } catch (err) {
      const message = err.message || 'Помилка реєстрації'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await api.logout()
      setUser(null)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await api.updateProfile(data)
      setUser(updated)
      return updated
    } catch (err) {
      const message = err.message || 'Не вдалося оновити профіль'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const forgotPassword = useCallback(async (email) => {
    setError(null)
    return api.forgotPassword(email)
  }, [])

  const resetPassword = useCallback(async ({ email, code, newPassword }) => {
    setError(null)
    return api.resetPassword({ email, code, newPassword })
  }, [])

  const value = {
    user,
    isAuth: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
