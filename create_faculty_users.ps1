# PowerShell script to create faculty users
# Make sure MySQL is running and accessible

Write-Host "Creating faculty users in the database..." -ForegroundColor Green

# Read the SQL file
$sqlContent = Get-Content -Path "create_faculty_users.sql" -Raw

# Execute the SQL
try {
    # You may need to adjust these connection parameters based on your MySQL setup
    mysql -u root -p student_portal -e $sqlContent
    
    Write-Host "Faculty users created successfully!" -ForegroundColor Green
    Write-Host "You can now login with these credentials:" -ForegroundColor Yellow
    Write-Host "Username: faculty1, Password: faculty123" -ForegroundColor Cyan
    Write-Host "Username: faculty2, Password: faculty123" -ForegroundColor Cyan
    Write-Host "Username: faculty3, Password: faculty123" -ForegroundColor Cyan
    Write-Host "Username: supervisor1, Password: faculty123" -ForegroundColor Cyan
    Write-Host "Username: supervisor2, Password: faculty123" -ForegroundColor Cyan
} catch {
    Write-Host "Error executing SQL: $_" -ForegroundColor Red
    Write-Host "Please make sure MySQL is running and the database exists." -ForegroundColor Yellow
    Write-Host "You can also manually execute the SQL in create_faculty_users.sql" -ForegroundColor Yellow
} 