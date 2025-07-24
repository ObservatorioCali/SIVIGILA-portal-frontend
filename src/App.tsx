import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
            <Dashboard /> 
        }
      />
    </Routes>
  )
}

export default App
