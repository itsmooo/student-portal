# Database Setup Instructions

## Prerequisites
- PostgreSQL installed and running on your system
- PostgreSQL client (psql) available in your PATH

## Option 1: Automatic Setup (Recommended for Windows)

Run the PowerShell script to automatically set up the database:

```powershell
# Run the setup script
.\setup_database.ps1
```

This script will:
- Find your PostgreSQL installation
- Create the `student_portal` database
- Apply the database schema
- Create all necessary indexes

## Option 2: Manual Setup

### For Windows Users

1. **Find PostgreSQL installation**:
   ```powershell
   # PostgreSQL is typically installed at:
   C:\Program Files\PostgreSQL\17\bin\psql.exe
   ```

2. **Create database**:
   ```powershell
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE student_portal;"
   ```

3. **Run schema script**:
   ```powershell
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d student_portal -f database_schema.sql
   ```

### For Linux/Mac Users

```bash
# Create database
psql -U postgres -c "CREATE DATABASE student_portal;"

# Run the schema script
psql -U postgres -d student_portal -f database_schema.sql
```

## Option 3: Let Spring Boot Create Tables (Simplest)

Since your application is configured with `spring.jpa.hibernate.ddl-auto=update`, you can simply:

1. **Create the database manually** (if it doesn't exist):
   ```powershell
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE student_portal;"
   ```

2. **Start your Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```

Hibernate will automatically create all tables based on your JPA entities.

## Verify Database Configuration

Ensure your `application.properties` file has the correct database configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_portal
spring.datasource.username=postgres
spring.datasource.password=12345
spring.datasource.driver-class-name=org.postgresql.Driver
```

## JPA Auto-Creation

The application is configured with `spring.jpa.hibernate.ddl-auto=update`, which means:
- Hibernate will automatically create/update tables based on your JPA entities
- If tables don't exist, they will be created
- If tables exist but schema differs, they will be updated
- Existing data will be preserved

## Database Schema Overview

### Users Table
- Stores user information (students, faculty, admins)
- Includes authentication details and role-based access
- Supports multiple roles: STUDENT, FACULTY, ADMIN

### Projects Table
- Stores project information submitted by students
- Links to student and supervisor users
- Tracks project status and progress
- Includes project timeline and resources

### Feedback Table
- Stores feedback from faculty on student projects
- Includes ratings and comments
- Links to both projects and faculty users

## Indexes
The following indexes are created for optimal performance:
- User lookups by username, email, and role
- Project lookups by student, supervisor, and status
- Feedback lookups by project and faculty

## Running the Application

After setting up the database:

```bash
# Start the Spring Boot application
./mvnw spring-boot:run
```

The application will automatically connect to the database and create/update tables as needed.

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `Get-Service -Name "*postgres*"`
- Verify connection details in `application.properties`
- Check if the database exists

### Permission Issues
- Ensure the postgres user has proper permissions
- Create a dedicated database user if needed

### Schema Issues
- If you need to reset the database, drop and recreate it
- Use `spring.jpa.hibernate.ddl-auto=create` temporarily to recreate all tables (WARNING: this will delete existing data)

### Windows-Specific Issues
- If `psql` is not recognized, use the full path: `"C:\Program Files\PostgreSQL\17\bin\psql.exe"`
- Ensure PostgreSQL service is running: `Get-Service postgresql-x64-17`
- Check Windows PATH environment variable includes PostgreSQL bin directory 