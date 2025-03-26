import { Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
} 