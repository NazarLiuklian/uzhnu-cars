import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { useAuth } from './hooks/useAuth'
import { AddCarPage } from './pages/AddCarPage'
import { AuthGatePage } from './pages/AuthGatePage'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  const { isAuth } = useAuth()

  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route
          path="/add-car"
          element={
            isAuth ? (
              <AddCarPage />
            ) : (
              <Navigate to="/auth-gate" replace state={{ from: '/add-car' }} />
            )
          }
        />
        <Route path="/auth-gate" element={<AuthGatePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            isAuth ? <ProfilePage /> : <Navigate to="/login" replace state={{ from: '/profile' }} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
