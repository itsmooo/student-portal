# Create admin user script
Write-Host "Creating admin user in database..." -ForegroundColor Green

# Database connection details
$server = "localhost"
$database = "student_portal"
$username = "root"
$password = ""

# SQL file path
$sqlFile = "create_admin_user.sql"

# Execute SQL script
try {
    mysql -h $server -u $username -p$password $database -e "source $sqlFile"
    Write-Host "Admin user created successfully!" -ForegroundColor Green
    Write-Host "Username: admin" -ForegroundColor Yellow
    Write-Host "Password: admin123" -ForegroundColor Yellow
    Write-Host "Email: admin@university.edu" -ForegroundColor Yellow
} catch {
    Write-Host "Error creating admin user: $_" -ForegroundColor Red
} 