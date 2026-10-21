import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { AddCarPage } from './pages/AddCarPage'
import { AuthGatePage } from './pages/AuthGatePage'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatsPage } from './pages/StatsPage'
import { initialCars } from './services/mockData'

export default function App() {
  const [user, setUser] = useState(null)
  const [cars, setCars] = useState(initialCars)
  const navigate = useNavigate()

  const handleLogin = (userData) => {
    const newUser = userData || {
      name: 'Назар Люклян',
      email: 'student@uzhnu.edu.ua',
      avatar: 'НЛ',
    }
    setUser(newUser)
    navigate('/add-car')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  const handleToggleFavorite = (carId) => {
    setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, favorite: !c.favorite } : c)))
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <CatalogPage
              cars={cars}
              isAuth={Boolean(user)}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route path="/stats" element={<StatsPage />} />
        <Route
          path="/add-car"
          element={user ? <AddCarPage user={user} /> : <Navigate to="/auth-gate" replace />}
        />
        <Route path="/auth-gate" element={<AuthGatePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage user={user} onUpdateUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
