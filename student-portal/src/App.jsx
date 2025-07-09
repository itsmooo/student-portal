import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './components/LandingPage'
import Home from './components/home'
import StudentDashboard from './components/StudentDashboard'
import AdminDashboard from './components/admin/DashbaordAdmin'
import FacultyDashboard from './components/FacultyDashboard'
import Project from './components/Project'
import Loading from './components/admin/Loading'
import { Navigate } from 'react-router-dom'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentDashboard />
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
              <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
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
          <Route 
            path="/redirect" 
            element={<DashboardRedirect />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

// Component to redirect users to their appropriate dashboard
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === "SUPERVISOR") {
    return <Navigate to="/faculty" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default App
