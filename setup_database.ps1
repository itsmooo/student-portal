# Database Setup Script for Student Portal
# This script will create the database and run the schema

Write-Host "Setting up Student Portal Database..." -ForegroundColor Green

# PostgreSQL installation path
$postgresPath = "C:\Program Files\PostgreSQL\17\bin"
$psqlPath = "$postgresPath\psql.exe"

# Check if psql exists
if (-not (Test-Path $psqlPath)) {
    Write-Host "Error: psql.exe not found at $psqlPath" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed correctly." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found PostgreSQL at: $postgresPath" -ForegroundColor Green

# Create database
Write-Host "Creating database 'student_portal'..." -ForegroundColor Yellow
try {
    & $psqlPath -U postgres -c "CREATE DATABASE student_portal;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database 'student_portal' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Database 'student_portal' might already exist (this is OK)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error creating database: $_" -ForegroundColor Red
}

# Run schema script
Write-Host "Running database schema..." -ForegroundColor Yellow
try {
    & $psqlPath -U postgres -d student_portal -f "database_schema.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database schema applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error applying schema. Check the error messages above." -ForegroundColor Red
    }
} catch {
    Write-Host "Error running schema: $_" -ForegroundColor Red
}

Write-Host "`nDatabase setup completed!" -ForegroundColor Green
Write-Host "You can now start your Spring Boot application." -ForegroundColor Cyan 