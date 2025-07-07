"use client";

import { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, projectAPI, authAPI } from "../../services/api";

export default function CleanAdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [projectsState, setProjectsState] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await userAPI.getAllUsers();
      console.log("Raw users from backend:", response.data);

      const processedUsers = response.data.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: "ACTIVE",
        joinDate: new Date().toISOString().split("T")[0],
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        supervisorName: user.supervisorName,
      }));

      console.log("Processed users:", processedUsers);
      setUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await projectAPI.getAllProjects();
      setProjectsState(
        response.data.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          student: project.studentName || "Unknown",
          faculty: project.supervisorName || "Unassigned",
          status: project.status,
          deadline: project.endDate,
          startDate: project.startDate,
          endDate: project.endDate,
          resources: project.resources,
          durationMonths: project.durationMonths,
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingReviews: 0,
  });

  // Update stats when users or projects change
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalProjects: projectsState.length,
      activeProjects: projectsState.filter((p) => p.status === "IN_PROGRESS")
        .length,
      pendingReviews: projectsState.filter((p) => p.status === "SUBMITTED")
        .length,
    });
  }, [users, projectsState]);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    faculty: "",
    supervisorName: "",
  });

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
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
  });

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDeleteUserId, setShowDeleteUserId] = useState(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showDeleteProjectId, setShowDeleteProjectId] = useState(null);

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700 border border-red-200";
      case "FACULTY":
        return "bg-green-100 text-green-700 border border-green-200";
      case "STUDENT":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border border-green-200";
      case "INACTIVE":
        return "bg-red-100 text-red-700 border border-red-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const handleUserStatusToggle = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : user
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const facultyOptions = [
    "Computer Science",
    "Economics",
    "Engineering",
    "Medicine",
    "Business",
    "Law",
    "Education",
    "Arts",
    "Science",
  ];

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = {
        ...newUser,
        role: "STUDENT",
      };
      await authAPI.register(userData);

      await fetchUsers();

      setNewUser({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        faculty: "",
        supervisorName: "",
      });
      setShowAddUserModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewUser({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      faculty: "",
      supervisorName: "",
    });
    setShowPassword(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsProjectLoading(true);
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        studentId: Number.parseInt(newProject.studentId),
        facultyId: newProject.facultyId
          ? Number.parseInt(newProject.facultyId)
          : null,
        startDate: newProject.startDate || null,
        endDate: newProject.endDate || null,
        resources: newProject.resources,
        durationMonths: newProject.durationMonths
          ? Number.parseInt(newProject.durationMonths)
          : null,
        status: "PENDING",
      };

      await projectAPI.createProject(projectData);

      await fetchProjects();

      setShowAddProjectModal(false);
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
      });
    } catch (error) {
      console.error("Error adding project:", error);
      setError("Failed to create project");
    } finally {
      setIsProjectLoading(false);
    }
  };

  // User Edit Handlers
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await userAPI.updateUser(updatedUser.id, updatedUser);
      await fetchUsers();
      setShowEditUserModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      await fetchUsers();
      setShowDeleteUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  // Project Edit Handlers
  const handleEditProject = (project) => {
    setEditProject(project);
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (updatedProject) => {
    try {
      const projectData = {
        title: updatedProject.title,
        description: updatedProject.description,
        category: updatedProject.category,
        studentId: Number.parseInt(updatedProject.studentId),
        facultyId: updatedProject.facultyId
          ? Number.parseInt(updatedProject.facultyId)
          : null,
        startDate: updatedProject.startDate || null,
        endDate: updatedProject.endDate || null,
        resources: updatedProject.resources,
        durationMonths: updatedProject.durationMonths
          ? Number.parseInt(updatedProject.durationMonths)
          : null,
        status: updatedProject.status,
      };

      await projectAPI.updateProject(updatedProject.id, projectData);
      await fetchProjects();
      setShowEditProjectModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectAPI.deleteProject(projectId);
      await fetchProjects();
      setShowDeleteProjectId(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project");
    }
  };

  const handleApproveProject = async (projectId) => {
    try {
      await projectAPI.approveProject(projectId);
      await fetchProjects();
      setError(null);
    } catch (error) {
      console.error("Error approving project:", error);
      setError("Failed to approve project");
    }
  };

  const handleRejectProject = async (projectId) => {
    try {
      await projectAPI.rejectProject(projectId);
      await fetchProjects();
      setError(null);
    } catch (error) {
      console.error("Error rejecting project:", error);
      setError("Failed to reject project");
    }
  };

  const handleAssignStudentToSupervisor = async (studentId, supervisorId) => {
    try {
      await userAPI.assignStudentToSupervisor(studentId, supervisorId);
      await fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error assigning student to supervisor:", error);
      setError("Failed to assign student to supervisor");
    }
  };

  const handleRemoveStudentFromSupervisor = async (studentId) => {
    try {
      await userAPI.removeStudentFromSupervisor(studentId);
      await fetchUsers();
      setError(null);
    } catch (error) {
      console.error("Error removing student from supervisor:", error);
      setError("Failed to remove student from supervisor");
    }
  };

  // Get students and faculty for dropdowns
  const students = users.filter((user) => user.role === "STUDENT");
  const faculty = users.filter((user) => user.role === "FACULTY");
  const availableStudents = students.length > 0 ? students : users;
  const availableFaculty =
    faculty.length > 0
      ? faculty
      : users.filter(
          (user) => user.role === "FACULTY" || user.role === "ADMIN"
        );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Clean Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-500">Management Dashboard</p>
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
                  <p className="text-xs text-blue-600">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={handleLogout}
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
        {/* Clean Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    +12% this month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProjects}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+8% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProjects}
                </p>
                <p className="text-xs text-yellow-600 mt-2">In progress</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReviews}
                </p>
                <p className="text-xs text-orange-600 mt-2">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Clean Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg mb-8 border border-white/20">
          <nav className="flex">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "Users" },
              { id: "projects", label: "Projects" },
              { id: "assignments", label: "Assignments" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50/50 rounded-t-2xl"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl hover:bg-gray-50/80 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        New project submitted
                      </p>
                      <p className="text-sm text-gray-600">
                        Web Development Portfolio by Jane Smith
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-white/20 rounded-xl hover:bg-gray-50/80 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        New faculty member joined
                      </p>
                      <p className="text-sm text-gray-600">
                        Dr. Sarah Smith registered
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage all users in your system
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Loading State */}
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : (
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
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            {searchTerm
                              ? "No users found matching your search."
                              : "No users found."}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-medium mr-3">
                                  {user.firstName?.[0]}
                                  {user.lastName?.[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-md ${getRoleColor(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.supervisorName || "Not assigned"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.joinDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteUserId(user.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Project Overview
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitor and manage all projects
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading projects...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectsState.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No projects found.
                    </div>
                  ) : (
                    projectsState.map((project) => (
                                          <div
                      key={project.id}
                      className="border border-white/20 rounded-xl p-6 hover:bg-gray-50/80 hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {project.title}
                                </h4>
                                <p className="text-gray-600 mt-1">
                                  {project.description}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(
                                  project.status
                                )}`}
                              >
                                {project.status.replace("_", " ")}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Student:</span>
                                <p className="font-medium">{project.student}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Faculty:</span>
                                <p className="font-medium">{project.faculty}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <p className="font-medium">
                                  {project.category}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Deadline:</span>
                                <p className="font-medium">
                                  {project.deadline}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteProjectId(project.id)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {project.status === "UNDER_REVIEW" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApproveProject(project.id)
                                  }
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectProject(project.id)
                                  }
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Student-Supervisor Assignments
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Assign students to supervisors and manage relationships
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await projectAPI.assignProjectsToSupervisors();
                      alert("Projects assigned to supervisors successfully!");
                    } catch (error) {
                      console.error("Error assigning projects:", error);
                      alert("Failed to assign projects to supervisors");
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Assign Projects to Supervisors
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students without supervisors */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">Students without Supervisors</h4>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users
                        .filter(user => user.role === "STUDENT" && !user.supervisorName)
                        .map(student => (
                          <div key={student.id} className="border border-white/20 rounded-xl p-4 bg-gray-50/80 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </h5>
                                <p className="text-sm text-gray-500">{student.email}</p>
                                <p className="text-xs text-blue-600">{student.faculty || "No faculty assigned"}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <select 
                                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAssignStudentToSupervisor(student.id, e.target.value);
                                    }
                                  }}
                                >
                                  <option value="">Assign to...</option>
                                  {users
                                    .filter(user => user.role === "SUPERVISOR")
                                    .map(supervisor => (
                                      <option key={supervisor.id} value={supervisor.id}>
                                        {supervisor.firstName} {supervisor.lastName}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      {users.filter(user => user.role === "STUDENT" && !user.supervisorName).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>All students have supervisors assigned.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Supervisors and their students */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">Supervisor Assignments</h4>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users
                        .filter(user => user.role === "SUPERVISOR")
                        .map(supervisor => {
                          const assignedStudents = users.filter(
                            student => student.role === "STUDENT" && 
                            student.supervisorName === `${supervisor.firstName} ${supervisor.lastName}`
                          );
                          return (
                            <div key={supervisor.id} className="border border-white/20 rounded-xl p-4 bg-green-50/80 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                              <div className="mb-3">
                                <h5 className="font-medium text-gray-900">
                                  {supervisor.firstName} {supervisor.lastName}
                                </h5>
                                <p className="text-sm text-gray-500">{supervisor.email}</p>
                                <p className="text-xs text-green-600">
                                  {assignedStudents.length} student(s) assigned
                                </p>
                              </div>
                              {assignedStudents.length > 0 && (
                                <div className="space-y-2">
                                  {assignedStudents.map(student => (
                                    <div key={student.id} className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:scale-[1.02] transition-all duration-300">
                                      <div>
                                        <p className="text-sm font-medium">{student.firstName} {student.lastName}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                      </div>
                                      <button 
                                        onClick={() => handleRemoveStudentFromSupervisor(student.id)}
                                        className="text-xs text-red-600 hover:text-red-800"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New User
              </h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="faculty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Faculty/Department *
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={newUser.faculty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select department</option>
                  {facultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="supervisorName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supervisor Name
                </label>
                <input
                  type="text"
                  id="supervisorName"
                  name="supervisorName"
                  value={newUser.supervisorName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. Smith"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Delete User Confirmation */}
      {showDeleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteUserId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteUserId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add similar modals for other operations... */}
    </div>
  );
}
