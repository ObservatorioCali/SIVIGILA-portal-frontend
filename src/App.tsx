import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import Characterization from './pages/Characterization'
import DirectorioInstitucional from './pages/DirectorioInstitucional'
import DirectorioProfesionales from './pages/DirectorioProfesionales'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard /> 
          </ProtectedRoute>
        }
      />
      <Route
        path="/characterization"
        element={
          <ProtectedRoute>
            <Characterization /> 
          </ProtectedRoute>
        }
      />
      <Route
        path="/directorio-institucional"
        element={
          <ProtectedRoute>
            <DirectorioInstitucional /> 
          </ProtectedRoute>
        }
      />
      <Route
        path="/directorio-profesionales"
        element={
          <ProtectedRoute>
            <DirectorioProfesionales /> 
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
