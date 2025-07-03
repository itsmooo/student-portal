# Quick Start Guide - Student Portal

## Prerequisites

### 1. Install Java 17 or later ✅ (COMPLETED)
- You have OpenJDK 22.0.2 installed at: `C:\Program Files\OpenJDK\jdk-22.0.2`

### 2. Set JAVA_HOME Environment Variable
**Option A: Automatic Setup (Recommended)**
```powershell
# Run the script to set JAVA_HOME permanently
.\set_java_home.ps1
```

**Option B: Manual Setup**
1. Open System Properties → Environment Variables
2. Add new User Variable:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\OpenJDK\jdk-22.0.2`
3. Add to PATH: `%JAVA_HOME%\bin`

### 3. PostgreSQL (Already installed) ✅
- Your PostgreSQL service is running
- Database will be created automatically

## Quick Setup

### Option 1: Automatic Setup (Recommended)
```powershell
# Set JAVA_HOME permanently
.\set_java_home.ps1

# Run the quick setup script
.\quick_setup.ps1
```

### Option 2: Manual Setup
```powershell
# 1. Set JAVA_HOME for current session
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-22.0.2"
$env:PATH += ";$env:JAVA_HOME\bin"

# 2. Create database (if needed)
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE student_portal;"

# 3. Start the application
./mvnw spring-boot:run
```

## What Happens Next

1. **Database Creation**: The application will automatically create all tables
2. **Application Start**: Spring Boot will start on port 8080
3. **API Access**: Your REST APIs will be available at `http://localhost:8080`

## Database Schema

The application will create these tables automatically:
- `users` - User accounts (students, faculty, admins)
- `projects` - Student projects with status tracking
- `feedback` - Faculty feedback on projects

## Troubleshooting

### Java Issues
- ✅ Java 22 is installed correctly
- Set JAVA_HOME using `.\set_java_home.ps1`
- Restart PowerShell after setting environment variables

### Database Issues
- PostgreSQL service must be running
- Check `application.properties` for correct database settings
- The application will create tables automatically

### Application Issues
- Check console output for error messages
- Ensure port 8080 is not in use
- Verify all dependencies are downloaded

## API Endpoints

Once running, you can access:
- `http://localhost:8080/api/auth/*` - Authentication
- `http://localhost:8080/api/users/*` - User management
- `http://localhost:8080/api/projects/*` - Project management
- `http://localhost:8080/api/feedback/*` - Feedback management

## Current Status

✅ **Java 22 installed**: `C:\Program Files\OpenJDK\jdk-22.0.2`
✅ **PostgreSQL running**: Service is active
✅ **Spring Boot starting**: Application is downloading dependencies
🔄 **Next step**: Set JAVA_HOME permanently and restart terminal 