import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sync state if user changes in other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'uzhnu_auth_user') {
        setUser(api.getCurrentUser())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
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

  const resetPassword = useCallback(async (credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await api.resetPassword(credentials)
      return updatedUser
    } catch (err) {
      const message = err.message || 'Не вдалося скинути пароль'
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
      const updated = await api.updateUser(data)
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

  const value = {
    user,
    isAuth: Boolean(user),
    isLoading,
    error,
    login,
    register,
    resetPassword,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
