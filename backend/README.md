# The Beast - Node.js + MongoDB Backend

## Quick Start

### 1. Install Dependencies
```bash
cd backend-node
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install chromium
```

### 3. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string

### 4. Configure Environment

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beast_db
JWT_SECRET=your-super-secret-key
OPENAI_API_KEY=sk-your-key
PORT=8000
```.

### 5. Run Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:8000**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify/:token` - Verify email

### Profile
- `GET /api/profile/me` - Get profile
- `PUT /api/profile/update` - Update profile
- `POST /api/profile/resume/upload` - Upload resume
- `POST /api/profile/automation/start` - **START automation**
- `POST /api/profile/automation/pause` - Pause
- `POST /api/profile/automation/stop` - Stop

## How It Works

1. **User registers** → uploads resume → sets job preferences
2. **Clicks START** → `/api/profile/automation/start`
3. **Job scraper** searches LinkedIn/Indeed/Glassdoor every 2 hours
4. **Application agent** auto-applies using Playwright
5. **User monitors** progress in dashboard

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Auth**: JWT + bcrypt
- **Automation**: Playwright
- **File Upload**: Multer

## MongoDB Collections

- `users` - User accounts
- `userprofiles` - Resumes & preferences
- `jobs` - Discovered jobs
- `applications` - Application tracking

## Next Steps

- Run job scraper worker: `npm run scraper`
- Build dashboard UI
- Add job search scheduler (node-cron)
- Deploy to production

**The Beast is ready to dominate! 🎯**
