"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  FileText,
  Clock,
  Star,
  LogOut,
  Settings,
  Bell,
  Plus,
  TrendingUp,
  Award,
  X,
  Target,
  Zap,
  Activity,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { projectAPI, progressUpdateAPI, evaluationAPI, documentAPI } from "../services/api"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loadingEvaluations, setLoadingEvaluations] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form states
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [proposalForm, setProposalForm] = useState({
    title: "",
    objective: "",
    tools: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    resources: "",
    durationMonths: "",
  })
  const [progressForm, setProgressForm] = useState({
    weekNumber: 1,
    updateDescription: "",
    feedback: "",
  })

  // Document related state
  const [documents, setDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)

  const fetchEvaluations = async () => {
    try {
      setLoadingEvaluations(true)
      const allEvaluations = []
      
      console.log("Fetching evaluations for projects:", projects)
      
      // Fetch evaluations for each of the student's projects
      for (const project of projects) {
        try {
          console.log(`Fetching evaluations for project ${project.id}: ${project.title}`)
          const response = await evaluationAPI.getEvaluationsByProject(project.id)
          console.log(`Response for project ${project.id}:`, response)
          
          if (response.data && response.data.length > 0) {
            console.log(`Found ${response.data.length} evaluations for project ${project.id}`)
            // Add project info to each evaluation
            const evaluationsWithProject = response.data.map(evaluation => ({
              ...evaluation,
              projectTitle: project.title,
              projectId: project.id
            }))
            allEvaluations.push(...evaluationsWithProject)
          } else {
            console.log(`No evaluations found for project ${project.id}`)
          }
        } catch (error) {
          console.error(`Error fetching evaluations for project ${project.id}:`, error)
        }
      }
      
      console.log("All evaluations:", allEvaluations)
      setEvaluations(allEvaluations)
    } catch (error) {
      console.error("Error fetching evaluations:", error)
    } finally {
      setLoadingEvaluations(false)
    }
  }

  useEffect(() => {
    fetchMyProjects()
  }, [])

  useEffect(() => {
    if (projects.length > 0 && activeTab === "evaluations") {
      fetchEvaluations()
    }
    if (activeTab === "documents") {
      fetchDocuments()
    }
  }, [projects, activeTab])

  const fetchMyProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getProjectsByUser(user.id)
      console.log("Fetched projects:", response.data)
      setProjects(response.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const handleProposalSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...proposalForm,
        studentId: user.id,
        status: "PENDING",
      }

      await projectAPI.createProject(projectData)
      setShowProposalModal(false)
      setProposalForm({
        title: "",
        objective: "",
        tools: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        resources: "",
        durationMonths: "",
      })
      fetchMyProjects()
    } catch (error) {
      console.error("Error submitting proposal:", error)
      setError("Failed to submit proposal")
    }
  }

  const handleProgressSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProject) {
      setError("Please select a project first")
      return
    }

    if (selectedProject.status !== "IN_PROGRESS" && selectedProject.status !== "APPROVED") {
      setError("You can only submit progress updates for approved projects (APPROVED or IN_PROGRESS status)")
      return
    }

    try {
      const progressData = {
        projectId: selectedProject.id,
        weekNumber: Number.parseInt(progressForm.weekNumber),
        updateDescription: progressForm.updateDescription,
        feedback: progressForm.feedback,
      }

      console.log("Submitting progress data:", progressData)
      console.log("Selected project:", selectedProject)

      const response = await progressUpdateAPI.createProgressUpdate(progressData)
      console.log("Progress update response:", response)

      setShowProgressModal(false)
      setProgressForm({
        weekNumber: 1,
        updateDescription: "",
        feedback: "",
      })
      setSelectedProject(null)
      setError(null)

      // Show success message
      alert("Progress update submitted successfully!")
    } catch (error) {
      console.error("Error submitting progress:", error)
      console.error("Error details:", error.response?.data)
      console.error("Error status:", error.response?.status)

      // Show more specific error messages
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.status === 400) {
        setError("Invalid data provided. Please check your input.")
      } else if (error.response?.status === 403) {
        setError("You don't have permission to submit progress updates for this project.")
      } else if (error.response?.status === 404) {
        setError("Project not found. Please try again.")
      } else {
        setError("Failed to submit progress update. Please try again.")
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border border-amber-200"
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-200"
      case "COMPLETED":
        return "bg-purple-100 text-purple-700 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  // Document functions
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true)
      const response = await documentAPI.getDocumentsForStudent(user.id)
      setDocuments(response.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoadingDocuments(false)
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

  const stats = {
    totalProjects: projects.length,
    pendingProjects: projects.filter((p) => p.status === "PENDING").length,
    approvedProjects: projects.filter((p) => p.status === "APPROVED" || p.status === "IN_PROGRESS").length,
    completedProjects: projects.filter((p) => p.status === "COMPLETED").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
                <p className="text-xs text-gray-500">Project Management Hub</p>
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
                  <p className="text-xs text-blue-600">Student</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">All time</span>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pendingProjects}</p>
                <p className="text-xs text-amber-600 mt-2">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 bg-amber-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedProjects}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">In progress</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">Finished</span>
                </div>
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
              { id: "overview", label: "Overview", icon: Target },
              { id: "projects", label: "My Projects", icon: FileText },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "evaluations", label: "Evaluations", icon: Star },
              { id: "documents", label: "Documents", icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50/50 rounded-t-2xl"
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
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user?.firstName}! 👋</h2>
                  <p className="text-gray-600 mt-1">Here's what's happening with your projects</p>
                </div>
                <button
                  onClick={() => setShowProposalModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Proposal
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No projects yet</p>
                      <button
                        onClick={() => setShowProposalModal(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Submit your first proposal
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-500">{project.category}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowProposalModal(true)}
                      className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Submit New Proposal</p>
                          <p className="text-sm text-gray-600">Create a new project proposal</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("progress")}
                      className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Update Progress</p>
                          <p className="text-sm text-gray-600">Submit weekly progress update</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("evaluations")}
                      className="w-full text-left p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">View Evaluations</p>
                          <p className="text-sm text-gray-600">Check your final scores</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage all your project proposals and submissions</p>
                </div>
                <button
                  onClick={() => setShowProposalModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Proposal
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading projects...</span>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Submit your first project proposal to get started.</p>
                  <button
                    onClick={() => setShowProposalModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit Proposal
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="font-medium">{project.category || "Not specified"}</span>
                        </div>
                        {project.startDate && (
                          <div className="flex justify-between">
                            <span>Start Date:</span>
                            <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex justify-between">
                            <span>End Date:</span>
                            <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project)
                            setShowProgressModal(true)
                          }}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Update Progress
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Details
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
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Progress Updates</h2>
                  <p className="text-sm text-gray-600 mt-1">Track your weekly progress and submit updates</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null)
                    setShowProgressModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Submit Update
                </button>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-500 mb-6">
                    Submit weekly progress updates to keep your supervisor informed about your project development.
                  </p>

                  {/* Debug information */}
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Project Status:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Total projects: {projects.length}</p>
                      {projects.map((project) => (
                        <p key={project.id}>
                          • {project.title} - {project.status}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evaluations Tab */}
          {activeTab === "evaluations" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Final Evaluations</h2>
                  <p className="text-sm text-gray-600 mt-1">View your project evaluations and feedback</p>
                </div>
              </div>
              
              {loadingEvaluations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading evaluations...</span>
                </div>
              ) : evaluations.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluations Yet</h3>
                  <p className="text-gray-500">
                    Your final project evaluations and feedback from supervisors will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{evaluation.projectTitle}</h4>
                          <p className="text-sm text-gray-600">
                            Evaluated on {new Date(evaluation.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">{evaluation.finalScore}/100</div>
                          <div className="text-xs text-gray-500">Final Score</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Evaluation Comments:</h5>
                          <p className="text-gray-700 bg-white/80 p-3 rounded-lg">{evaluation.finalComment}</p>
                        </div>
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
                  <p className="text-sm text-gray-600 mt-1">Access documents shared by your supervisor</p>
                </div>
              </div>
              
              {loadingDocuments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading documents...</span>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                  <p className="text-gray-500">
                    Documents shared by your supervisor will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{document.title}</h4>
                            <p className="text-sm text-gray-600">{document.description}</p>
                            <p className="text-xs text-blue-600">
                              Shared by {document.supervisorName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(document.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDocumentDownload(document.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Submit Project Proposal</h2>
                  <p className="text-sm text-gray-600 mt-1">Fill out the details for your new project</p>
                </div>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleProposalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={proposalForm.category}
                      onChange={(e) => setProposalForm({ ...proposalForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Web Development, Mobile App"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Objective *</label>
                  <textarea
                    required
                    rows={3}
                    value={proposalForm.objective}
                    onChange={(e) => setProposalForm({ ...proposalForm, objective: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the main objective of your project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tools & Technologies</label>
                  <textarea
                    rows={2}
                    value={proposalForm.tools}
                    onChange={(e) => setProposalForm({ ...proposalForm, tools: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List the tools, technologies, and frameworks you plan to use..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide a detailed description of your project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={proposalForm.startDate}
                      onChange={(e) => setProposalForm({ ...proposalForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={proposalForm.endDate}
                      onChange={(e) => setProposalForm({ ...proposalForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                    <input
                      type="number"
                      value={proposalForm.durationMonths}
                      onChange={(e) => setProposalForm({ ...proposalForm, durationMonths: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resources</label>
                  <textarea
                    rows={2}
                    value={proposalForm.resources}
                    onChange={(e) => setProposalForm({ ...proposalForm, resources: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List any resources, references, or materials you'll need..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Submit Progress Update</h2>
                  <p className="text-sm text-gray-600 mt-1">Share your weekly progress with your supervisor</p>
                </div>
                <button
                  onClick={() => {
                    setShowProgressModal(false)
                    setError(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleProgressSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {selectedProject ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Project: {selectedProject.title}</p>
                    <p className="text-xs text-blue-700">Status: {selectedProject.status}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Project *</label>
                    <select
                      required
                      value=""
                      onChange={(e) => {
                        const project = projects.find((p) => p.id === Number.parseInt(e.target.value))
                        setSelectedProject(project)
                        setError(null)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a project...</option>
                      {projects
                        .filter((project) => project.status === "APPROVED" || project.status === "IN_PROGRESS")
                        .map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title} ({project.status})
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Available projects: {projects.filter((p) => p.status === "APPROVED" || p.status === "IN_PROGRESS").length}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Week Number *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={progressForm.weekNumber}
                    onChange={(e) => setProgressForm({ ...progressForm, weekNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={progressForm.updateDescription}
                    onChange={(e) => setProgressForm({ ...progressForm, updateDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what you've completed this week, challenges faced, and next steps..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={2}
                    value={progressForm.feedback}
                    onChange={(e) => setProgressForm({ ...progressForm, feedback: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional notes or requests for your supervisor..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProgressModal(false)
                      setError(null)
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Submit Update
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
