# Start The Beast - Complete Automation System

Write-Host "`nStarting The Beast Automation System...`n" -ForegroundColor Cyan

# Check if we're in the correct directory
if (!(Test-Path "backend") -or !(Test-Path "dashboard")) {
    Write-Host "Error: Please run this script from the JobAutomation root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Backend API Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Dashboard..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd dashboard; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Automation Workers (Job Hunting Engine)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node src/workers/scheduler.js" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "`nThe Beast is now FULLY OPERATIONAL!`n" -ForegroundColor Green
Write-Host "--------------------------------------------" -ForegroundColor Cyan
Write-Host "Frontend Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API:        http://localhost:8000" -ForegroundColor White
Write-Host "Workers:            Running in background" -ForegroundColor White
Write-Host "--------------------------------------------" -ForegroundColor Cyan
Write-Host "`n3 terminal windows have been opened:" -ForegroundColor Yellow
Write-Host "   1. Backend API Server (port 8000)" -ForegroundColor Gray
Write-Host "   2. Frontend Dashboard (port 3000)" -ForegroundColor Gray
Write-Host "   3. Automation Workers (job hunting)" -ForegroundColor Gray
Write-Host "`nGo to http://localhost:3000 to access the dashboard" -ForegroundColor Magenta
Write-Host "`nThe Beast is hunting jobs for you! Check terminal 3 for activity.`n" -ForegroundColor Green
