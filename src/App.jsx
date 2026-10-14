import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AddCarPage } from './pages/AddCarPage'
import { AuthGatePage } from './pages/AuthGatePage'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatsPage } from './pages/StatsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/add-car" element={<AddCarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/auth-gate" element={<AuthGatePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
