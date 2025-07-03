import { useState, useEffect } from "react"
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  UserPlus,
  Shield,
  AlertTriangle,
  LogOut,
  Bell,
  Search,
  MoreHorizontal,
  X,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react"
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [user] = useState({
    name: "Admin User",
    email: "admin@university.edu",
    role: "ADMIN",
  })

  const [users, setUsers] = useState([])
  const [projectsState, setProjectsState] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchUsers()
    fetchProjects()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const response = await axios.get('http://localhost:8080/users')
      console.log('Raw users from backend:', response.data)
      
      const processedUsers = response.data.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: "ACTIVE", // You might want to add status to your User entity
        joinDate: new Date().toISOString().split('T')[0], // You might want to add joinDate to your User entity
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        supervisorName: user.supervisorName,
      }))
      
      console.log('Processed users:', processedUsers)
      setUsers(processedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true)
      const response = await axios.get('http://localhost:8080/projects')
      setProjectsState(response.data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        student: project.studentName || 'Unknown',
        faculty: project.supervisorName || 'Unassigned',
        status: project.status,
        deadline: project.endDate,
        startDate: project.startDate,
        endDate: project.endDate,
        resources: project.resources,
        durationMonths: project.durationMonths,
      })))
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingReviews: 0,
  })

  // Update stats when users or projects change
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalProjects: projectsState.length,
      activeProjects: projectsState.filter((p) => p.status === "IN_PROGRESS").length,
      pendingReviews: projectsState.filter((p) => p.status === "SUBMITTED").length,
    })
  }, [users, projectsState])

  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Add User Form State
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    faculty: "",
    supervisorName: "",
  })

  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [isProjectLoading, setIsProjectLoading] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    studentId: "",
    facultyId: "",
    startDate: "",
    endDate: "",
    resources: "",
    durationMonths: "",
    status: "PENDING",
  })

  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [showDeleteUserId, setShowDeleteUserId] = useState(null)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [showDeleteProjectId, setShowDeleteProjectId] = useState(null)

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "FACULTY":
        return "bg-green-100 text-green-800"
      case "STUDENT":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "INACTIVE":
        return "bg-red-100 text-red-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleUserStatusToggle = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : user,
      ),
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const facultyOptions = [
    "Computer Science",
    "Economics",
    "Engineering",
    "Medicine",
    "Business",
    "Law",
    "Education",
    "Arts",
    "Science"
  ]

  const handleAddUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Create user in backend
      const userData = {
        ...newUser,
        role: "STUDENT",
      }
      await axios.post('http://localhost:8080/api/auth/register', userData)
      
      // Refresh users list from backend
      await fetchUsers()
      
      // Reset form and close modal
      setNewUser({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        faculty: "",
        supervisorName: "",
      })
      setShowAddUserModal(false)
    } catch (error) {
      console.error("Error adding user:", error)
      setError('Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNewUser({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      faculty: "",
      supervisorName: "",
    })
    setShowPassword(false)
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    setIsProjectLoading(true)
    try {
      // Create project in backend with proper IDs
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        studentId: parseInt(newProject.studentId),
        facultyId: newProject.facultyId ? parseInt(newProject.facultyId) : null,
        startDate: newProject.startDate || null,
        endDate: newProject.endDate || null,
        resources: newProject.resources,
        durationMonths: newProject.durationMonths ? parseInt(newProject.durationMonths) : null,
        status: "PENDING",
      }
      
      await axios.post('http://localhost:8080/projects', projectData)
      
      // Refresh projects list from backend
      await fetchProjects()
      
      setShowAddProjectModal(false)
      setNewProject({
        title: "",
        description: "",
        category: "",
        studentId: "",
        facultyId: "",
        startDate: "",
        endDate: "",
        resources: "",
        durationMonths: "",
        status: "PENDING",
      })
    } catch (error) {
      console.error("Error adding project:", error)
      setError('Failed to create project')
    } finally {
      setIsProjectLoading(false)
    }
  }

  // User Edit Handlers
  const handleEditUser = (user) => {
    setEditUser(user)
    setShowEditUserModal(true)
  }
  const handleUpdateUser = async (updatedUser) => {
    try {
      // Update user in backend
      await axios.put(`http://localhost:8080/users/${updatedUser.id}`, updatedUser)
      
      // Refresh users list from backend
      await fetchUsers()
      
      setShowEditUserModal(false)
    } catch (error) {
      console.error("Error updating user:", error)
      setError('Failed to update user')
    }
  }
  const handleDeleteUser = async (userId) => {
    try {
      // Delete user from backend
      await axios.delete(`http://localhost:8080/users/${userId}`)
      
      // Refresh users list from backend
      await fetchUsers()
      
      setShowDeleteUserId(null)
    } catch (error) {
      console.error("Error deleting user:", error)
      setError('Failed to delete user')
    }
  }

  // Project Edit Handlers
  const handleEditProject = (project) => {
    setEditProject(project)
    setShowEditProjectModal(true)
  }
  const handleUpdateProject = async (updatedProject) => {
    try {
      // Update project in backend with proper IDs
      const projectData = {
        title: updatedProject.title,
        description: updatedProject.description,
        category: updatedProject.category,
        studentId: parseInt(updatedProject.studentId),
        facultyId: updatedProject.facultyId ? parseInt(updatedProject.facultyId) : null,
        startDate: updatedProject.startDate || null,
        endDate: updatedProject.endDate || null,
        resources: updatedProject.resources,
        durationMonths: updatedProject.durationMonths ? parseInt(updatedProject.durationMonths) : null,
        status: updatedProject.status,
      }
      
      await axios.put(`http://localhost:8080/projects/${updatedProject.id}`, projectData)
      
      // Refresh projects list from backend
      await fetchProjects()
      
      setShowEditProjectModal(false)
    } catch (error) {
      console.error("Error updating project:", error)
      setError('Failed to update project')
    }
  }
  const handleDeleteProject = async (projectId) => {
    try {
      // Delete project from backend
      await axios.delete(`http://localhost:8080/projects/${projectId}`)
      
      // Refresh projects list from backend
      await fetchProjects()
      
      setShowDeleteProjectId(null)
    } catch (error) {
      console.error("Error deleting project:", error)
      setError('Failed to delete project')
    }
  }

  // Get students and faculty for dropdowns
  const students = users.filter(user => user.role === 'STUDENT')
  const faculty = users.filter(user => user.role === 'FACULTY')

  // Debug logging
  console.log('All users:', users)
  console.log('Students:', students)
  console.log('Faculty:', faculty)
  console.log('User roles:', users.map(u => ({ name: u.name, role: u.role })))

  // Fallback: if no students found, show all users
  const availableStudents = students.length > 0 ? students : users
  const availableFaculty = faculty.length > 0 ? faculty : users.filter(user => user.role === 'FACULTY' || user.role === 'ADMIN')

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "projects"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Projects
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New project submitted</p>
                        <p className="text-sm text-gray-600">Web Development Portfolio by Jane Smith</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New faculty member joined</p>
                        <p className="text-sm text-gray-600">Dr. Sarah Smith registered</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Debug Info - Remove this later */}
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm">
                    <strong>Debug Info:</strong> Total Users: {users.length} | 
                    Students: {students.length} | 
                    Faculty: {faculty.length} | 
                    Available Students: {availableStudents.length}
                  </p>
                  {users.length > 0 && (
                    <p className="text-blue-600 text-xs mt-1">
                      User roles: {users.map(u => `${u.name}(${u.role})`).join(', ')}
                    </p>
                  )}
                </div>

                {/* Loading State */}
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading users...</span>
                  </div>
                ) : (
                  <>
                    {/* Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Supervisor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Join Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.supervisorName || 'Not assigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.joinDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                    title="Edit"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteUserId(user.id)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUserStatusToggle(user.id)}
                                    className={`ml-2 ${user.status === "ACTIVE" ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}
                                  >
                                    {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
                  <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Add Project
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Loading State */}
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading projects...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectsState.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No projects found.
                      </div>
                    ) : (
                      projectsState.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{project.title}</h4>
                            <p className="text-sm text-gray-600">
                              Student: {project.student} • Faculty: {project.faculty}
                            </p>
                            <p className="text-sm text-gray-500">Deadline: {project.deadline}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                              {project.status.replace("_", " ")}
                            </span>
                            <button
                              onClick={() => handleEditProject(project)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteProjectId(project.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false)
                  resetForm()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                />
              </div>

              {/* Faculty/Department */}
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty/Department *
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={newUser.faculty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select faculty/department</option>
                  {facultyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Supervisor Name */}
              <div>
                <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor Name
                </label>
                <input
                  type="text"
                  id="supervisorName"
                  name="supervisorName"
                  value={newUser.supervisorName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter supervisor name"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleProjectInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleProjectInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newProject.category}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category (optional)"
                />
              </div>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  id="studentId"
                  name="studentId"
                  value={newProject.studentId}
                  onChange={handleProjectInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a student</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700 mb-1">Faculty (Optional)</label>
                <select
                  id="facultyId"
                  name="facultyId"
                  value={newProject.facultyId}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a faculty member (optional)</option>
                  {availableFaculty.map(facultyMember => (
                    <option key={facultyMember.id} value={facultyMember.id}>
                      {facultyMember.name} ({facultyMember.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newProject.startDate}
                    onChange={handleProjectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newProject.endDate}
                    onChange={handleProjectInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-1">Resources</label>
                <input
                  type="text"
                  id="resources"
                  name="resources"
                  value={newProject.resources}
                  onChange={handleProjectInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resources (optional)"
                />
              </div>
              <div>
                <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                <input
                  type="number"
                  id="durationMonths"
                  name="durationMonths"
                  value={newProject.durationMonths}
                  onChange={handleProjectInputChange}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter duration in months (optional)"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProjectLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProjectLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button onClick={() => setShowEditUserModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateUser(editUser);
              }}
              className="p-6 space-y-4"
            >
              {/* Same fields as Add User, pre-filled */}
              <div>
                <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  id="edit-username"
                  name="username"
                  value={editUser.username}
                  onChange={e => setEditUser({ ...editUser, username: e.target.value })}
                  required
                  minLength={3}
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  id="edit-firstName"
                  name="firstName"
                  value={editUser.firstName}
                  onChange={e => setEditUser({ ...editUser, firstName: e.target.value })}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  id="edit-lastName"
                  name="lastName"
                  value={editUser.lastName}
                  onChange={e => setEditUser({ ...editUser, lastName: e.target.value })}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-faculty" className="block text-sm font-medium text-gray-700 mb-1">Faculty/Department *</label>
                <input
                  type="text"
                  id="edit-faculty"
                  name="faculty"
                  value={editUser.faculty}
                  onChange={e => setEditUser({ ...editUser, faculty: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-supervisorName" className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
                <input
                  type="text"
                  id="edit-supervisorName"
                  name="supervisorName"
                  value={editUser.supervisorName}
                  onChange={e => setEditUser({ ...editUser, supervisorName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter supervisor name"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowEditUserModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {showDeleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteUserId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteUser(showDeleteUserId)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && editProject && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Project</h3>
              <button onClick={() => setShowEditProjectModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateProject(editProject);
              }}
              className="p-6 space-y-4"
            >
              {/* Same fields as Add Project, pre-filled */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editProject.title}
                  onChange={e => setEditProject({ ...editProject, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editProject.description}
                  onChange={e => setEditProject({ ...editProject, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  id="edit-category"
                  name="category"
                  value={editProject.category}
                  onChange={e => setEditProject({ ...editProject, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-studentId" className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  id="edit-studentId"
                  name="studentId"
                  value={editProject.studentId}
                  onChange={e => setEditProject({ ...editProject, studentId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a student</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-facultyId" className="block text-sm font-medium text-gray-700 mb-1">Faculty (Optional)</label>
                <select
                  id="edit-facultyId"
                  name="facultyId"
                  value={editProject.facultyId}
                  onChange={e => setEditProject({ ...editProject, facultyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a faculty member (optional)</option>
                  {availableFaculty.map(facultyMember => (
                    <option key={facultyMember.id} value={facultyMember.id}>
                      {facultyMember.name} ({facultyMember.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="edit-startDate"
                    name="startDate"
                    value={editProject.startDate}
                    onChange={e => setEditProject({ ...editProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    id="edit-endDate"
                    name="endDate"
                    value={editProject.endDate}
                    onChange={e => setEditProject({ ...editProject, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="edit-resources" className="block text-sm font-medium text-gray-700 mb-1">Resources</label>
                <input
                  type="text"
                  id="edit-resources"
                  name="resources"
                  value={editProject.resources}
                  onChange={e => setEditProject({ ...editProject, resources: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-durationMonths" className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                <input
                  type="number"
                  id="edit-durationMonths"
                  name="durationMonths"
                  value={editProject.durationMonths}
                  onChange={e => setEditProject({ ...editProject, durationMonths: e.target.value })}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  value={editProject.status}
                  onChange={e => setEditProject({ ...editProject, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowEditProjectModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Update Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation */}
      {showDeleteProjectId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Project</h3>
            <p>Are you sure you want to delete this project?</p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteProjectId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteProject(showDeleteProjectId)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
