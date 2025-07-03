# Full Stack Student Portal Runner
# This script runs both the Spring Boot backend and React frontend

Write-Host "🚀 Starting Full Stack Student Portal..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Set JAVA_HOME for this session
$env:JAVA_HOME = "C:\Program Files\OpenJDK\jdk-22.0.2"
$env:PATH += ";$env:JAVA_HOME\bin"

# Check if Java is available
try {
    $javaVersion = & "$env:JAVA_HOME\bin\java.exe" -version 2>&1
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install Java 17+ and set JAVA_HOME" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is running
$postgresService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue
if ($postgresService -and $postgresService.Status -eq "Running") {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL is not running. Please start PostgreSQL service" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "student-portal"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

Write-Host "`n🔄 Starting Spring Boot backend..." -ForegroundColor Yellow
Set-Location ".."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./mvnw spring-boot:run" -WindowStyle Normal

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n🎨 Starting React frontend..." -ForegroundColor Yellow
Set-Location "student-portal"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host "`n🎉 Full Stack Student Portal is starting!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "📊 Database: PostgreSQL (student_portal)" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "`n🛑 Stopping services..." -ForegroundColor Yellow
    # Cleanup can be added here if needed
} 