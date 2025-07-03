"use client"

import { useState } from "react"
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Star,
  MessageSquare,
  Eye,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"

export default function FacultyDashboard() {
  const [user] = useState({
    name: "Dr. Sarah Smith",
    email: "sarah.smith@university.edu",
    role: "FACULTY",
  })

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Machine Learning Research Project",
      student: "John Doe",
      studentEmail: "john.doe@university.edu",
      status: "UNDER_REVIEW",
      submittedDate: "2024-01-10",
      deadline: "2024-05-15",
      description: "Developing a new algorithm for image recognition using deep learning techniques.",
    },
    {
      id: 2,
      title: "Web Development Portfolio",
      student: "Jane Smith",
      studentEmail: "jane.smith@university.edu",
      status: "APPROVED",
      submittedDate: "2024-01-08",
      deadline: "2024-04-20",
      description: "Creating a comprehensive web application with modern frameworks.",
    },
  ])

  const [selectedProject, setSelectedProject] = useState(null)
  const [feedbackForm, setFeedbackForm] = useState({
    content: "",
    rating: 5,
    suggestions: "",
  })
  const [activeTab, setActiveTab] = useState("projects")

  const getStatusColor = (status) => {
    switch (status) {
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "NEEDS_REVISION":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement feedback submission API call
    console.log("Feedback for project:", selectedProject.id, feedbackForm)
    setSelectedProject(null)
    setFeedbackForm({ content: "", rating: 5, suggestions: "" })
  }

  const handleProjectAction = (projectId, action) => {
    // TODO: Implement project approval/rejection API calls
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: action } : p)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Faculty Portal</h1>
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
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "UNDER_REVIEW").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "APPROVED").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(projects.map((p) => p.student)).size}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("projects")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "projects"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Project Reviews
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Students
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "feedback"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Feedback History
              </button>
            </nav>
          </div>

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            By {project.student} • Submitted {project.submittedDate}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-700">{project.description}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <p>Student: {project.student}</p>
                          <p>Email: {project.studentEmail}</p>
                          <p>Deadline: {project.deadline}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </button>
                          {project.status === "UNDER_REVIEW" && (
                            <>
                              <button
                                onClick={() => handleProjectAction(project.id, "APPROVED")}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleProjectAction(project.id, "REJECTED")}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Students</h3>
              <div className="space-y-4">
                {Array.from(new Set(projects.map((p) => p.student))).map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{student}</h4>
                      <p className="text-sm text-gray-600">
                        {projects.filter((p) => p.student === student).length} projects
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback History</h3>
              <p className="text-gray-600">No feedback history available yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Feedback Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Review: {selectedProject.title}
              </h3>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={feedbackForm.content}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Provide detailed feedback..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className="text-2xl"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedbackForm.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggestions
                  </label>
                  <textarea
                    value={feedbackForm.suggestions}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Suggestions for improvement..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Feedback
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
