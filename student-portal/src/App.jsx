import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/home'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/admin/DashbaordAdmin'
import FacultyDashboard from './components/Foculty'
import Project from './components/Project'
import Loading from './components/admin/Loading'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty" 
            element={
              <ProtectedRoute allowedRoles={["FACULTY"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project" 
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            } 
          />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
