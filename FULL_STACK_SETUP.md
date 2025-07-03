# Full Stack Student Portal Setup Guide

## 🎯 Overview

This project consists of:
- **Backend**: Spring Boot API (Port 8080)
- **Frontend**: React + Vite (Port 5173)
- **Database**: PostgreSQL

## 📋 Prerequisites

### ✅ Already Installed
- Java 22 (OpenJDK)
- PostgreSQL 17
- Spring Boot Backend (Running)

### 🔧 Need to Install
- **Node.js** (for React frontend)
  - Download from: https://nodejs.org/
  - Recommended version: 18.x or later

## 🚀 Quick Start (Recommended)

### Option 1: Automatic Setup
```powershell
# Run the full stack script
.\run-full-stack.ps1
```

This script will:
- ✅ Check all prerequisites
- 📦 Install frontend dependencies
- 🔄 Start Spring Boot backend
- 🎨 Start React frontend
- 🌐 Open both applications

### Option 2: Manual Setup

#### Step 1: Install Frontend Dependencies
```powershell
cd student-portal
npm install
```

#### Step 2: Start Backend (if not running)
```powershell
# In the root directory
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-22.0.2"
$env:PATH += ";$env:JAVA_HOME\bin"
./mvnw spring-boot:run
```

#### Step 3: Start Frontend
```powershell
# In a new terminal, navigate to frontend
cd student-portal
npm run dev
```

## 🌐 Application URLs

Once both applications are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database**: PostgreSQL (student_portal)

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (Admin/Faculty)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Create feedback
- `PUT /api/feedback/{id}` - Update feedback
- `DELETE /api/feedback/{id}` - Delete feedback

## 🎭 User Roles

The application supports three user roles:

1. **STUDENT**
   - Can create and manage their own projects
   - Can view feedback on their projects
   - Access to student dashboard

2. **FACULTY**
   - Can view all projects
   - Can provide feedback on projects
   - Can manage students
   - Access to faculty dashboard

3. **ADMIN**
   - Full system access
   - Can manage all users, projects, and feedback
   - Access to admin dashboard

## 🔧 Configuration

### Backend Configuration
- **Database**: PostgreSQL on localhost:5432
- **Database Name**: student_portal
- **JPA**: Auto-creates tables from entities
- **CORS**: Configured for frontend (localhost:5173)

### Frontend Configuration
- **API Base URL**: http://localhost:8080/api
- **Authentication**: JWT token-based
- **Routing**: React Router with protected routes
- **Styling**: Tailwind CSS

## 🗄️ Database Schema

The application automatically creates these tables:

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    supervisor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    end_date DATE,
    resources TEXT,
    duration_months INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    faculty_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Troubleshooting

### Backend Issues
- **JAVA_HOME not set**: Run `.\set_java_home.ps1`
- **Database connection failed**: Ensure PostgreSQL is running
- **Port 8080 in use**: Change port in `application.properties`

### Frontend Issues
- **Node.js not found**: Install Node.js from https://nodejs.org/
- **Dependencies missing**: Run `npm install` in `student-portal/`
- **Port 5173 in use**: Vite will automatically use next available port

### CORS Issues
- Backend CORS is configured for `localhost:5173`
- If using different port, update `application.properties`

## 📱 Testing the Application

1. **Register a new user** at http://localhost:5173
2. **Login** with your credentials
3. **Navigate** to your role-specific dashboard
4. **Create projects** (students) or **review projects** (faculty/admin)

## 🎉 Success!

Your full-stack Student Portal is now running with:
- ✅ Spring Boot backend with REST APIs
- ✅ React frontend with role-based access
- ✅ PostgreSQL database with automatic schema creation
- ✅ JWT authentication
- ✅ CORS configuration for seamless integration

Both applications are now working together! 🚀 