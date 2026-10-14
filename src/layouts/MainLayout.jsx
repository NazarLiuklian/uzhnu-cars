import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
