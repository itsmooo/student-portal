import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { BookOpen, Users, FileText, Clock, CheckCircle, AlertCircle, Plus, LogOut, Settings, Bell } from "lucide-react"

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Machine Learning Research Project",
      description: "Developing a new algorithm for image recognition",
      status: "IN_PROGRESS",
      supervisor: "Dr. Smith",
      deadline: "2024-05-15",
      lastUpdate: "2024-01-10",
    },
    {
      id: 2,
      title: "Web Development Portfolio",
      description: "Creating a comprehensive web application",
      status: "SUBMITTED",
      supervisor: "Prof. Johnson",
      deadline: "2024-04-20",
      lastUpdate: "2024-01-08",
    },
  ])

  const [feedback, setFeedback] = useState([
    {
      id: 1,
      projectId: 1,
      content: "Great progress on the algorithm implementation. Consider adding more test cases.",
      rating: 4,
      faculty: "Dr. Smith",
      date: "2024-01-09",
    },
  ])

  const [activeTab, setActiveTab] = useState("projects")

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Project Portal</h1>
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
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "IN_PROGRESS").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "SUBMITTED").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
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
                  My Projects
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "feedback"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Feedback
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "submissions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Submissions
                </button>
              </nav>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
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
                          <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Supervisor</p>
                          <p className="text-gray-900">{project.supervisor}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Deadline</p>
                          <p className="text-gray-900">{project.deadline}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Last Update</p>
                          <p className="text-gray-900">{project.lastUpdate}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          View Details
                        </button>
                        {project.status === "IN_PROGRESS" && (
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Submit Project
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{item.faculty}</h4>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{item.content}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <CheckCircle
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{item.rating}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission History</h3>
                <div className="space-y-4">
                  {projects.filter((p) => p.status === "SUBMITTED").map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">Submitted on {project.lastUpdate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
