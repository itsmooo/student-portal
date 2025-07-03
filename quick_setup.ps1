# Quick Setup Script for Student Portal
Write-Host "Student Portal Quick Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Check if Java is installed
Write-Host "`nChecking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion) {
        Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Java not found" -ForegroundColor Red
        Write-Host "Please install Java 17 or later from: https://adoptium.net/" -ForegroundColor Yellow
        Write-Host "Then set JAVA_HOME environment variable and restart this script." -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "✗ Java not found" -ForegroundColor Red
    Write-Host "Please install Java 17 or later from: https://adoptium.net/" -ForegroundColor Yellow
    Write-Host "Then set JAVA_HOME environment variable and restart this script." -ForegroundColor Yellow
    exit 1
}
# Check if PostgreSQL is running
Write-Host "`nChecking PostgreSQL..." -ForegroundColor Yellow
$postgresService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue
if ($postgresService -and $postgresService.Status -eq "Running") {
    Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
}
else {
    Write-Host "✗ PostgreSQL is not running" -ForegroundColor Red
    Write-Host "Please start PostgreSQL service" -ForegroundColor Yellow
    exit 1
}

# Try to create database (if it doesn't exist)
Write-Host "`nSetting up database..." -ForegroundColor Yellow
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (Test-Path $psqlPath) {
    try {
        # Create database (ignore errors if it already exists)
        & $psqlPath -U postgres -c "CREATE DATABASE student_portal;" 2>$null
        Write-Host "✓ Database setup completed" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ Database might already exist (this is OK)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠ PostgreSQL client not found at expected location" -ForegroundColor Yellow
    Write-Host "The application will try to create tables automatically" -ForegroundColor Cyan
}

# Start the application
Write-Host "`nStarting Spring Boot application..." -ForegroundColor Yellow
Write-Host "The application will create database tables automatically." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the application." -ForegroundColor Yellow

try {
    ./mvnw spring-boot:run
}
catch {
    Write-Host "Error starting application: $_" -ForegroundColor Red
    Write-Host "Make sure you have Java installed and JAVA_HOME set correctly." -ForegroundColor Yellow
} 