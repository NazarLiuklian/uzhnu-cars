import { useEffect, useState } from 'react'
import { Header } from './components/Header/Header'
import { AddCarPage } from './pages/AddCarPage'
import { AuthGatePage } from './pages/AuthGatePage'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { StatsPage } from './pages/StatsPage'
import { initialCars } from './services/mockData'

function parseInitialView() {
  const path = window.location.pathname.replace(/^\//, '')
  if (['stats', 'add-car', 'auth-gate', 'login', 'profile'].includes(path)) {
    return path
  }
  return 'catalog'
}

export default function App() {
  const [activeView, setActiveView] = useState(parseInitialView)
  const [user, setUser] = useState(null)
  const [cars, setCars] = useState(initialCars)

  const goTo = (viewId, currentUser = user) => {
    // If guest attempts to open add-car, redirect to auth-gate
    if (viewId === 'add-car' && !currentUser) {
      viewId = 'auth-gate'
    }

    setActiveView(viewId)

    const path = viewId === 'catalog' ? '/' : `/${viewId}`
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path)
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const view = parseInitialView()
      setActiveView(view)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleLogin = (userData) => {
    const newUser = userData || {
      name: 'Назар Люклян',
      email: 'student@uzhnu.edu.ua',
      avatar: 'НЛ',
    }
    setUser(newUser)
    goTo('add-car', newUser)
  }

  const handleLogout = () => {
    setUser(null)
    goTo('catalog', null)
  }

  const handleToggleFavorite = (carId) => {
    setCars((prev) => prev.map((c) => (c.id === carId ? { ...c, favorite: !c.favorite } : c)))
  }

  return (
    <div className="app-container">
      <Header activeView={activeView} goTo={goTo} user={user} onLogout={handleLogout} />

      {activeView === 'catalog' && (
        <CatalogPage cars={cars} isAuth={Boolean(user)} onToggleFavorite={handleToggleFavorite} />
      )}

      {activeView === 'stats' && <StatsPage />}

      {activeView === 'auth-gate' && <AuthGatePage goTo={goTo} />}

      {activeView === 'login' && <LoginPage onLogin={handleLogin} />}

      {activeView === 'add-car' && <AddCarPage user={user} />}

      {activeView === 'profile' && <ProfilePage user={user} onUpdateUser={setUser} goTo={goTo} />}
    </div>
  )
}
