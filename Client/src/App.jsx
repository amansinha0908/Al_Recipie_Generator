import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage'
import GeneratePage from './pages/GeneratePage'
import CookbookPage from './pages/CookbookPage'
import MealPlanPage from './pages/MealPlanPage'
import Navbar from './components/Navbar'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{textAlign:'center',padding:'80px',fontSize:'18px'}}>Loading...</div>
  return user ? children : <Navigate to="/auth" />
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
        <Route path="/cookbook" element={<ProtectedRoute><CookbookPage /></ProtectedRoute>} />
        <Route path="/mealplan" element={<ProtectedRoute><MealPlanPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App