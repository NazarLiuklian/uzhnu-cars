import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { MainLayout } from './layouts/MainLayout'
import { AddCarPage } from './pages/AddCarPage'
import { AuthGatePage } from './pages/AuthGatePage'
import { AuthPage } from './pages/AuthPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/add-car" element={isAuthenticated ? <AddCarPage /> : <AuthGatePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/auth" element={<AuthPage onLogin={() => setIsAuthenticated(true)} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
