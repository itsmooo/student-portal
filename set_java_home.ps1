# Set JAVA_HOME Environment Variable Permanently
Write-Host "Setting JAVA_HOME Environment Variable..." -ForegroundColor Green

# Java installation path
$javaPath = "C:\Program Files\OpenJDK\jdk-22.0.2"

# Check if Java path exists
if (-not (Test-Path $javaPath)) {
    Write-Host "Error: Java installation not found at $javaPath" -ForegroundColor Red
    exit 1
}

Write-Host "Found Java at: $javaPath" -ForegroundColor Green

# Set JAVA_HOME for current user
try {
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, "User")
    Write-Host "✓ JAVA_HOME set successfully for current user" -ForegroundColor Green
} catch {
    Write-Host "Error setting JAVA_HOME: $_" -ForegroundColor Red
    exit 1
}

# Add Java bin to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$javaBinPath = "$javaPath\bin"

if ($currentPath -notlike "*$javaBinPath*") {
    try {
        $newPath = $currentPath + ";" + $javaBinPath
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
        Write-Host "✓ Added Java bin to PATH" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not add Java bin to PATH: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Java bin already in PATH" -ForegroundColor Green
}

Write-Host "`nJAVA_HOME has been set permanently!" -ForegroundColor Green
Write-Host "You may need to restart your terminal/PowerShell for changes to take effect." -ForegroundColor Yellow
Write-Host "`nTo verify, run: java -version" -ForegroundColor Cyan 