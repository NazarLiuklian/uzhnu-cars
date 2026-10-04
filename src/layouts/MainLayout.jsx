import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function MainLayout({ isAuthenticated }) {
  return (
    <div className="app-shell">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
