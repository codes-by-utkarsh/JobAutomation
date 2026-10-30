# The Beast - Autonomous Job Application Platform

Fully autonomous SaaS platform for job searching and applying.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB
- **Automation**: Playwright (Headless Browser)
- **Frontend**: Next.js (Dashboard)
- **AI**: OpenAI (Resume Customization)

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npx playwright install chromium

# Create .env
cp .env.example .env
# Update .env with MongoDB URI & OpenAI Key

# Run
npm run dev
```

### 2. Dashboard Setup
```bash
cd dashboard
npm install
npm run dev
```

### 3. Run with Docker
```bash
docker-compose up --build
```

## Features
- **Auto-Search**: Scrapes LinkedIn, Indeed, Glassdoor every 2 hours
- **Auto-Apply**: Headless browser applies to jobs
- **Profile Management**: Upload resume, set preferences
- **Strategy Engine**: Adapts application strategy based on context

## Documentation
- See `backend/README.md` for API docs
- See `saas_platform_plan.md` for architecture
