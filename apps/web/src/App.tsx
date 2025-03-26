import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import ContentCheck from '@/pages/ContentCheck'
import Chat from '@/pages/Chat'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import PrivateRoute from '@/components/PrivateRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="check"
                element={
                  <PrivateRoute>
                    <ContentCheck />
                  </PrivateRoute>
                }
              />
              <Route
                path="chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App 