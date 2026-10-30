# The Beast - Quick Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  THE BEAST - NODE.JS SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "[2/5] Installing NPM packages..." -ForegroundColor Yellow
npm install
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green

# Install Playwright browsers
Write-Host "[3/5] Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install chromium
Write-Host "  ✓ Playwright ready" -ForegroundColor Green

# Create .env file
Write-Host "[4/5] Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "  ✓ Created .env file" -ForegroundColor Green
    Write-Host "  ⚠ Please update .env with your MongoDB URI and API keys" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ .env already exists" -ForegroundColor Green
}

# Create uploads directory
Write-Host "[5/5] Creating upload directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads/resumes" | Out-Null
Write-Host "  ✓ Upload directories created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Update .env with your MongoDB Atlas URI" -ForegroundColor Gray
Write-Host "2. Run: npm run dev" -ForegroundColor Gray
Write-Host "3. Server will start at http://localhost:8000" -ForegroundColor Gray
Write-Host ""
Write-Host "Optional: Run job scheduler in separate terminal:" -ForegroundColor White
Write-Host "  node src/workers/scheduler.js" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy hunting! 🎯" -ForegroundColor Green
