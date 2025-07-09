"use client"

import { useState, useEffect } from "react"
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Eye,
  LogOut,
  Settings,
  Bell,
  X,
  MoreHorizontal,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Filter,
  Search,
  Download,
} from "lucide-react"
import { projectAPI, evaluationAPI, userAPI, progressUpdateAPI, documentAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function FacultyDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTab, setActiveTab] = useState("projects")
  const [reviewComment, setReviewComment] = useState("")

  const [evaluation, setEvaluation] = useState({ score: "", comment: "" })
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [showStudentProjectsModal, setShowStudentProjectsModal] = useState(false)
  const [selectedStudentProjects, setSelectedStudentProjects] = useState([])
  const [selectedStudentName, setSelectedStudentName] = useState("")
  const [selectedProjectForProgress, setSelectedProjectForProgress] = useState(null)
  const [selectedProjectForEvaluation, setSelectedProjectForEvaluation] = useState(null)
  const [progressUpdatesForProject, setProgressUpdatesForProject] = useState([])
  const [loadingProgressUpdates, setLoadingProgressUpdates] = useState(false)
  
  // Document related state
  const [documents, setDocuments] = useState([])
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentForm, setDocumentForm] = useState({
    title: "",
    description: "",
    studentId: ""
  })
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)

  useEffect(() => {
    fetchProjects()
    if (activeTab === "students") {
      fetchMyStudents()
    }
    if (activeTab === "documents") {
      fetchDocuments()
    }
  }, [activeTab])

  const fetchProjects = async () => {
    try {
      console.log("Current user:", user)
      console.log("User role:", user?.role)
      console.log("User ID:", user?.id)
      
      // For supervisors, get projects from their assigned students
      if (user?.role === 'SUPERVISOR') {
        console.log("Fetching projects for supervisor ID:", user.id)
        // First try to get supervisor-specific projects
        const supervisorRes = await projectAPI.getProjectsBySupervisorStudents(user.id)
        console.log("Supervisor projects response:", supervisorRes.data)
        
        // Debug: Also get all projects to see if there are any in the system
        const allRes = await projectAPI.getAllProjects()
        console.log("All projects in system:", allRes.data)
        console.log("Total projects count:", allRes.data.length)
        console.log("Projects with PENDING status:", allRes.data.filter(p => p.status === 'PENDING'))
        
        setProjects(supervisorRes.data)
      } else {
        console.log("Fetching all projects for non-supervisor")
        // For admins and other roles, get all projects
        const res = await projectAPI.getAllProjects()
        console.log("All projects response:", res.data)
        setProjects(res.data)
      }
    } catch (e) {
      console.error("Error fetching projects:", e)
    }
  }

  const fetchMyStudents = async () => {
    try {
      setLoadingStudents(true)
      const res = await userAPI.getMyStudents()
      setStudents(res.data)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleApprove = async (projectId) => {
    await projectAPI.approveProject(projectId)
    setShowReviewModal(false)
    fetchProjects()
  }

  const handleReject = async (projectId) => {
    await projectAPI.rejectProject(projectId)
    setShowReviewModal(false)
    fetchProjects()
  }



  const fetchProgressUpdates = async (projectId) => {
    try {
      setLoadingProgressUpdates(true)
      const response = await progressUpdateAPI.getProgressUpdatesByProject(projectId)
      setProgressUpdatesForProject(response.data)
    } catch (error) {
      console.error("Error fetching progress updates:", error)
    } finally {
      setLoadingProgressUpdates(false)
    }
  }

  const handleCompleteProject = async (projectId) => {
    try {
      await projectAPI.completeProject(projectId)
      fetchProjects()
      alert("Project marked as completed successfully!")
    } catch (error) {
      console.error("Error completing project:", error)
      alert("Failed to complete project")
    }
  }

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault()
    try {
      await evaluationAPI.createEvaluation({
        projectId: selectedProjectForEvaluation.id,
        finalScore: parseInt(evaluation.score),
        finalComment: evaluation.comment,
      })
      setShowEvaluationModal(false)
      setEvaluation({ score: "", comment: "" })
      setSelectedProjectForEvaluation(null)
      fetchProjects()
      alert("Evaluation submitted successfully!")
    } catch (error) {
      console.error("Error submitting evaluation:", error)
      alert("Failed to submit evaluation")
    }
  }

  // Document functions
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true)
      const response = await documentAPI.getDocumentsBySupervisor(user.id)
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoadingDocuments(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDocumentUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Please select a file")
      return
    }

    try {
      setUploadingDocument(true)
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("title", documentForm.title)
      formData.append("description", documentForm.description)
      formData.append("supervisorId", user.id)
      if (documentForm.studentId) {
        formData.append("studentId", documentForm.studentId)
      }

      await documentAPI.uploadDocument(formData)
      
      setShowDocumentUploadModal(false)
      setSelectedFile(null)
      setDocumentForm({ title: "", description: "", studentId: "" })
      fetchDocuments()
      alert("Document uploaded successfully!")
    } catch (error) {
      console.error("Error uploading document:", error)
      alert("Failed to upload document")
    } finally {
      setUploadingDocument(false)
    }
  }

  const handleDocumentDownload = async (documentId) => {
    try {
      const response = await documentAPI.downloadDocument(documentId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'document')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error downloading document:", error)
      alert("Failed to download document")
    }
  }

  const handleDocumentDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await documentAPI.deleteDocument(documentId)
        fetchDocuments()
        alert("Document deleted successfully!")
      } catch (error) {
        console.error("Error deleting document:", error)
        alert("Failed to delete document")
      }
    }
  }

  // Export functionality
  const handleExportProjects = () => {
    const projectsToExport = projects.filter((p) => p.status === "UNDER_REVIEW")
    
    if (projectsToExport.length === 0) {
      alert("No projects to export")
      return
    }

    // Create CSV content
    const headers = [
      "Project Title",
      "Student Name",
      "Status",
      "Description",
      "Category",
      "Duration (Months)",
      "Start Date",
      "End Date",
      "Submitted Date"
    ]

    const csvContent = [
      headers.join(","),
      ...projectsToExport.map(project => [
        `"${project.title || ""}"`,
        `"${project.studentName || project.student || ""}"`,
        `"${project.status || ""}"`,
        `"${(project.description || "").replace(/"/g, '""')}"`,
        `"${project.category || ""}"`,
        `"${project.durationMonths || ""}"`,
        `"${project.startDate || ""}"`,
        `"${project.endDate || ""}"`,
        `"${new Date().toLocaleDateString()}"`
      ].join(","))
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `pending_projects_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border border-amber-200"
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      case "COMPLETED":
        return "bg-purple-100 text-purple-700 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const stats = {
    totalProjects: projects.length,
    pendingReview: projects.filter((p) => p.status === "PENDING").length,
    approved: projects.filter((p) => p.status === "APPROVED" || p.status === "IN_PROGRESS").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Faculty Dashboard</h1>
                <p className="text-xs text-gray-500">Project Management Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-green-600">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <button
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">All time</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
                <p className="text-xs text-amber-600 mt-2">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-amber-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-xs text-green-600 mt-2">Active projects</p>
              </div>
              <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-purple-600 mt-2">Finished</p>
              </div>
              <div className="w-12 h-12 bg-purple-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg mb-8 border border-white/20">
          <nav className="flex">
            {[
              { id: "projects", label: "Proposals", icon: FileText },
              { id: "students", label: "Students", icon: Users },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "evaluation", label: "Evaluation", icon: Star },
              { id: "documents", label: "Documents", icon: BookOpen },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-green-600 bg-green-50/50 rounded-t-2xl"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Proposals Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pending Proposals</h2>
                  <p className="text-sm text-gray-600 mt-1">Review and approve student project proposals</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button 
                    onClick={handleExportProjects}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {projects
                  .filter((p) => p.status === "PENDING")
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/20"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                              <p className="text-sm text-gray-600">By {project.studentName || project.student}</p>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(project.status)}`}
                            >
                              {project.status.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Submitted: {new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Duration: {project.durationMonths || "N/A"} months</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(project)
                              setShowReviewModal(true)
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Review
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {projects.filter((p) => p.status === "PENDING").length === 0 && (
                  <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending proposals</h3>
                    <p className="text-gray-500">All proposals have been reviewed.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Assigned Students</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your supervised students</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No students assigned to you yet.</p>
                  <p className="text-sm mt-2">Contact admin to get students assigned.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-xl hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                          <p className="text-xs text-blue-600">{student.faculty || "No faculty assigned"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            // Filter projects to show only this student's projects
                            const studentProjects = projects.filter(p => 
                              p.studentName === `${student.firstName} ${student.lastName}`
                            );
                            setSelectedStudentProjects(studentProjects);
                            setSelectedStudentName(`${student.firstName} ${student.lastName}`);
                            setShowStudentProjectsModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          View Projects ({projects.filter(p => p.studentName === `${student.firstName} ${student.lastName}`).length})
                        </button>

                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                          Send Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Progress</h2>
                  <p className="text-sm text-gray-600 mt-1">Track student progress and provide feedback</p>
                </div>
              </div>
              
              {projects.filter(p => p.status === "IN_PROGRESS" || p.status === "APPROVED").length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No active projects to track progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.filter(p => p.status === "IN_PROGRESS" || p.status === "APPROVED").map((project) => (
                    <div key={project.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">By {project.studentName || project.student}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProjectForProgress(project)
                            fetchProgressUpdates(project.id)
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Progress Updates
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProjectForEvaluation(project)
                            setShowEvaluationModal(true)
                          }}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Evaluate Project
                        </button>
                        <button
                          onClick={() => handleCompleteProject(project.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Evaluation Tab */}
          {activeTab === "evaluation" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Final Evaluation</h2>
                  <p className="text-sm text-gray-600 mt-1">Evaluate completed projects</p>
                </div>
              </div>
              
              {projects.filter(p => p.status === "IN_PROGRESS" || p.status === "APPROVED" || p.status === "COMPLETED").length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No projects available for evaluation.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.filter(p => p.status === "IN_PROGRESS" || p.status === "APPROVED" || p.status === "COMPLETED").map((project) => (
                    <div key={project.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">By {project.studentName || project.student}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProjectForEvaluation(project)
                            setShowEvaluationModal(true)
                          }}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Evaluate Project
                        </button>
                        {(project.status === "IN_PROGRESS" || project.status === "APPROVED") && (
                          <button
                            onClick={() => handleCompleteProject(project.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                  <p className="text-sm text-gray-600 mt-1">Upload and manage documents for your students</p>
                </div>
                <button
                  onClick={() => setShowDocumentUploadModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Upload Document
                </button>
              </div>
              
              {loadingDocuments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No documents uploaded yet.</p>
                  <p className="text-sm mt-2">Upload documents to share with your students.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-xl hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-500">{document.description}</p>
                          <p className="text-xs text-blue-600">
                            {document.studentName ? `For: ${document.studentName}` : "General document"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDocumentDownload(document.id)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDocumentDelete(document.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-600 mt-1">Stay updated with important alerts</p>
                </div>
              </div>
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>No new notifications.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Review Modal */}
      {showReviewModal && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Proposal</h3>
                  <p className="text-lg font-medium text-gray-700">{selectedProject.title}</p>
                  <p className="text-sm text-gray-600">By {selectedProject.studentName || selectedProject.student}</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-700">{selectedProject.category || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                    <p className="text-gray-700">{selectedProject.durationMonths || "Not specified"} months</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="reviewComment" className="block font-medium text-gray-900 mb-2">
                    Review Comments (Optional)
                  </label>
                  <textarea
                    id="reviewComment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Add your feedback or comments..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedProject.id)}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedProject.id)}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Projects Modal */}
      {showStudentProjectsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Projects</h3>
                  <p className="text-lg font-medium text-gray-700">{selectedStudentName}</p>
                </div>
                <button
                  onClick={() => setShowStudentProjectsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {selectedStudentProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No projects found for this student.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedStudentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.category}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(project.status)}`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Duration:</span>
                          <p>{project.durationMonths || "N/A"} months</p>
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span>
                          <p>{project.progress || 0}%</p>
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span>
                          <p>{project.startDate || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span>
                          <p>{project.endDate || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        {project.status === "PENDING" && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await projectAPI.approveProject(project.id);
                                  setShowStudentProjectsModal(false);
                                  fetchProjects();
                                  alert("Project approved successfully!");
                                } catch (error) {
                                  console.error("Error approving project:", error);
                                  alert("Failed to approve project");
                                }
                              }}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await projectAPI.rejectProject(project.id);
                                  setShowStudentProjectsModal(false);
                                  fetchProjects();
                                  alert("Project rejected successfully!");
                                } catch (error) {
                                  console.error("Error rejecting project:", error);
                                  alert("Failed to reject project");
                                }
                              }}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Updates Modal */}
      {selectedProjectForProgress && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Updates</h3>
                  <p className="text-lg font-medium text-gray-700">{selectedProjectForProgress.title}</p>
                  <p className="text-sm text-gray-600">By {selectedProjectForProgress.studentName || selectedProjectForProgress.student}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProjectForProgress(null)
                    setProgressUpdatesForProject([])
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {loadingProgressUpdates ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Loading progress updates...</span>
                </div>
              ) : progressUpdatesForProject.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No progress updates found for this project.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressUpdatesForProject.map((update) => (
                    <div key={update.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Week {update.weekNumber}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(update.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Progress Description:</h5>
                          <p className="text-gray-700 bg-white/80 p-3 rounded-lg">{update.updateDescription}</p>
                        </div>
                        
                        {update.feedback && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Additional Notes:</h5>
                            <p className="text-gray-700 bg-white/80 p-3 rounded-lg">{update.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedProjectForEvaluation && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Evaluation</h3>
                  <p className="text-lg font-medium text-gray-700">{selectedProjectForEvaluation.title}</p>
                  <p className="text-sm text-gray-600">By {selectedProjectForEvaluation.studentName || selectedProjectForEvaluation.student}</p>
                </div>
                <button
                  onClick={() => {
                    setShowEvaluationModal(false)
                    setSelectedProjectForEvaluation(null)
                    setEvaluation({ score: "", comment: "" })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Score (0-100) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={evaluation.score}
                    onChange={(e) => setEvaluation({ ...evaluation, score: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="85"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Comments *</label>
                  <textarea
                    required
                    rows={4}
                    value={evaluation.comment}
                    onChange={(e) => setEvaluation({ ...evaluation, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Provide detailed feedback on the project..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEvaluationModal(false)
                      setSelectedProjectForEvaluation(null)
                      setEvaluation({ score: "", comment: "" })
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Submit Evaluation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Document</h3>
                  <p className="text-sm text-gray-600">Share documents with your students</p>
                </div>
                <button
                  onClick={() => {
                    setShowDocumentUploadModal(false)
                    setSelectedFile(null)
                    setDocumentForm({ title: "", description: "", studentId: "" })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleDocumentUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={documentForm.title}
                    onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Project Guidelines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={documentForm.description}
                    onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of the document..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Student (Optional)</label>
                  <select
                    value={documentForm.studentId}
                    onChange={(e) => setDocumentForm({ ...documentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">General document (for all students)</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File *</label>
                  <input
                    type="file"
                    required
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT</p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDocumentUploadModal(false)
                      setSelectedFile(null)
                      setDocumentForm({ title: "", description: "", studentId: "" })
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingDocument}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingDocument ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
