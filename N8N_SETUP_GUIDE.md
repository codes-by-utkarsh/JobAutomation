# 🚀 The Beast - n8n Integration Setup Guide

## What You'll Get

A fully automated, AI-powered job hunting system that:
- ✅ **Searches** LinkedIn & Indeed every 2 hours
- ✅ **Analyzes** jobs using OpenAI GPT-4
- ✅ **Auto-applies** to matching positions
- ✅ **Sends notifications** when applications are submitted
- ✅ **Updates** your dashboard in real-time
- ✅ **No manual intervention** needed!

---

## Prerequisites Installed

✅ n8n (you're installing it now!)
✅ Node.js backend running
✅ MongoDB database connected
✅ OpenAI API key (you already have this)

---

## Step 1: Complete n8n Installation

Wait for the installation to finish, then verify:

```bash
n8n --version
```

You should see something like `n8n@1.x.x`

---

## Step 2: Start n8n

Open a **NEW terminal** (Terminal #3) and run:

```bash
n8n start
```

You'll see:
```
n8n ready on http://localhost:5678
```

**Keep this terminal running!**

---

## Step 3: Access n8n Dashboard

1. Open your browser
2. Go to: **http://localhost:5678**
3. Create your n8n account (first time):
   - Email: your@email.com
   - Password: (choose a secure password)

---

## Step 4: Configure Credentials in n8n

### A. MongoDB Credentials

1. Click **Settings** (gear icon) → **Credentials**
2. Click **+ New Credential**
3. Search for "MongoDB"
4. Fill in:
   - **Name**: `The Beast MongoDB`
   - **Connection String**: Your MongoDB Atlas URI from `.env`
   - Example: `mongodb+srv://user:password@cluster.mongodb.net/beast`
5. Click **Test** → Should show "Connection test successful"
6. Click **Save**

### B. OpenAI Credentials

1. Click **+ New Credential** again
2. Search for "OpenAI"
3. Fill in:
   - **Name**: `The Beast OpenAI`
   - **API Key**: Your OpenAI API key from backend `.env`
4. Click **Save**

### C. Email Credentials (Optional - for notifications)

1. Click **+ New Credential**
2. Search for "Gmail" or "SMTP"
3. **For Gmail**:
   - Email: your_gmail@gmail.com
   - **App Password**: (generate from Google Account settings)
   - [How to create App Password](https://support.google.com/accounts/answer/185833)
4. Click **Test** & **Save**

---

## Step 5: Import The Beast Workflow

1. In n8n dashboard, click **Workflows** (left sidebar)
2. Click **+ Add Workflow**
3. Click **...** (three dots) → **Import from File**
4. Navigate to: `D:\Projects\JobAutomation\n8n-workflows\beast-job-hunting.json`
5. Click **Open**

The complete workflow will load! 🎉

---

## Step 6: Configure Workflow Nodes

### Update These Nodes:

#### 1. **Get Active Users** (MongoDB node)
- Click on the node
- Select credential: `The Beast MongoDB`
- Database: `beast` (or your database name)
- Collection: `userprofiles`
- Query: `{"automationStatus": "running"}` ✅ Already configured

#### 2. **OpenAI GPT-4** (AI Model node)
- Click on the node
- Select credential: `The Beast OpenAI`
- Model: `gpt-4` or `gpt-3.5-turbo`

#### 3. **Save New Job** (MongoDB node)
- Select credential: `The Beast MongoDB`
- Database: `beast`
- Collection: `jobs`

#### 4. **Save Application** (MongoDB node)
- Select credential: `The Beast MongoDB`
- Database: `beast`
- Collection: `applications`

#### 5. **Update User Stats** (MongoDB node)
- Select credential: `The Beast MongoDB`
- Database: `beast`
- Collection: `userprofiles`

#### 6. **Send Email Notification** (Email node - Optional)
- Select your email credential
- Or disable this node if you don't want emails

---

## Step 7: Test the Workflow

### Manual Test:

1. Click **Execute Workflow** button (top right)
2. Watch it run! You'll see:
   - ✅ MongoDB fetches active users
   - ✅ Searches LinkedIn & Indeed
   - ✅ Parses job listings
   - ✅ AI analyzes each job
   - ✅ Auto-applies to high-scoring jobs
   - ✅ Saves to database

### Check Results:
- Open your dashboard: http://localhost:3000/dashboard/applications
- You should see new applications appearing!

---

## Step 8: Activate Automation

1. In n8n, click the **toggle** at top (Inactive → **Active**)
2. The workflow will now run **every 2 hours** automatically!

---

## Step 9: Monitor the System

### Three Running Terminals:

**Terminal 1 - Backend API**
```bash
cd backend
npm run dev
# Shows API requests
```

**Terminal 2 - Frontend Dashboard**
```bash
cd dashboard
npm run dev
# Shows Next.js compilation
```

**Terminal 3 - n8n Workflow Engine** (NEW!)
```bash
n8n start
# Shows workflow executions
```

### Check n8n Executions:
- Go to: http://localhost:5678
- Click **Executions** in sidebar
- See every workflow run with full logs!

---

## How It Works - Complete Flow

```
⏰ Every 2 Hours (Cron Trigger)
    ↓
📊 Get Active Users from MongoDB
    ↓
👤 For Each User with status="running"
    ↓
🔗 Build Search URLs (LinkedIn + Indeed)
    ↓
🔍 Fetch Jobs from Both Platforms
    ↓
📝 Parse Job Listings (Extract links)
    ↓
🔄 Loop Through Each Job
    ↓
⏱️ Wait 15 seconds (avoid rate limits)
    ↓
📄 Get Job Details (title, company, description)
    ↓
🗄️ Check if Job Already Exists in DB
    ↓
💾 Save New Job to MongoDB
    ↓
🤖 AI Analyzes Job Match
    - Calculate match score (0-100)
    - Determine action (APPLY/SKIP)
    - Generate custom cover letter
    ↓
✅ If Score > 70% AND Action = APPLY
    ↓
🚀 Auto-Apply via Backend API
    ↓
💾 Save Application Record
    ↓
📈 Update User Statistics
    ↓
📧 Send Email Notification
    ↓
🔁 Loop to Next Job
```

---

## Workflow Configuration Options

### Change Search Frequency:

In **Every 2 Hours** node:
- Click on "Schedule Trigger"
- Change `hoursInterval` from `2` to:
  - `1` for every hour
  - `4` for every 4 hours
  - `6` for every 6 hours

### Adjust Match Score Threshold:

In **Should Apply?** node:
- Change `70` to:
  - `60` for more applications (lower bar)
  - `80` for fewer, better-matched applications

### Add More Job Platforms:

Duplicate the **Search LinkedIn** node and modify URL for:
- Glassdoor
- Monster
- ZipRecruiter

---

## Monitoring & Debugging

### View Execution Logs:
1. Go to n8n: http://localhost:5678
2. Click **Executions** (left sidebar)
3. Click any execution to see:
   - Each node's input/output
   - Errors (if any)
   - Execution time
   - Data flow

### Check Database:
```bash
# MongoDB Compass or Atlas
# Check collections:
- jobs (new jobs discovered)
- applications (submitted applications)
- userprofiles (updated stats)
```

### Dashboard Stats:
- Go to: http://localhost:3000/dashboard
- See live updates:
  - Total Applications
  - Interviews Received
  - Success Rate

---

## Troubleshooting

### Issue: Workflow not finding users
**Solution**: 
- Ensure your profile status is "running"
- Check MongoDB connection
- Verify database name matches

### Issue: AI analysis fails
**Solution**:
- Check OpenAI API key is valid
- Ensure you have credits/billing set up
- Try switching to `gpt-3.5-turbo` (cheaper)

### Issue: Auto-apply returns 404
**Solution**:
- Ensure backend is running on port 8000
- Check applications route is registered
- Restart backend: `npm run dev`

### Issue: Emails not sending
**Solution**:
- Verify email credentials
- For Gmail, use App Password (not regular password)
- Or disable email node if not needed

### Issue: Rate limiting from job sites
**Solution**:
- Increase wait time in "Wait 15s" node to 30s
- Add proxy rotation (advanced)
- Use Browserless.io for stealth mode

---

## Cost Breakdown (Monthly)

| Service | Cost | What For |
|---------|------|----------|
| n8n (self-hosted) | **FREE** | Workflow automation |
| MongoDB Atlas (M0) | **FREE** | Database storage |
| OpenAI API | $20-100 | AI job matching & cover letters |
| **TOTAL** | **$20-100/mo** | Fully automated! |

### Saving Money:
- Use `gpt-3.5-turbo` instead of `gpt-4` (10x cheaper)
- Reduce search frequency to every 4 hours
- Set higher match threshold (fewer applications)

---

## Advanced Features (Optional)

### Add CAPTCHA Solving:
1. Sign up for 2Captcha
2. Add HTTP Request node after "Auto-Apply"
3. Send CAPTCHA to solver
4. Wait for solution
5. Continue application

### Add Proxy Rotation:
1. Sign up for Bright Data
2. Add proxy config to HTTP Request nodes
3. Rotate on each job fetch

### Add Telegram Notifications:
1. Create Telegram bot
2. Add Telegram node after "Save Application"
3. Get instant mobile notifications!

---

## Production Deployment (Optional)

### Deploy n8n to Cloud:

**Option 1: n8n Cloud** ($20/month)
- Hosted n8n (no setup needed)
- Automatic updates
- Built-in monitoring

**Option 2: Self-Hosted on VPS** ($5-10/month)
- Deploy to DigitalOcean/AWS
- Install n8n via Docker
- More control, cheaper

### Backend + Frontend Deployment:
- **Frontend**: Vercel (free)
- **Backend**: Heroku/Railway (free tier)
- **MongoDB**: Atlas (free M0 cluster)

---

## Success Metrics to Track

After 1 week, check:
- ✅ How many jobs discovered?
- ✅ How many applications submitted?
- ✅ Match score average?
- ✅ Any errors in executions?

**Expected Results**:
- 100-200 jobs discovered/day
- 10-30 applications/day (70%+ match)
- 80-90% workflow success rate

---

## Next Steps

### Week 1: Test & Optimize
- Run workflow manually a few times
- Check if applications are saving
- Verify dashboard updates
- Adjust match threshold

### Week 2: Full Automation
- Activate workflow
- Let it run for 1 week
- Monitor executions daily
- Check for any failures

### Week 3: Scale Up
- Add more job platforms
- Lower match threshold if needed
- Add email notifications
- Consider CAPTCHA solving

### Week 4: Interview Tracking
- Update application status when you get interviews
- Track success rate
- Optimize based on what's working

---

## 🎉 You're All Set!

You now have a **complete, automated job hunting system** powered by:
- 🤖 AI (OpenAI GPT-4)
- 🔄 Workflow Automation (n8n)
- 💾 Database (MongoDB)
- 🎨 Beautiful Dashboard (Next.js)

**The Beast is now hunting jobs for you 24/7!** 🦁

### Quick Reference Commands:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd dashboard && npm run dev

# Terminal 3: n8n
n8n start
```

**Access Points**:
- Dashboard: http://localhost:3000
- n8n: http://localhost:5678
- Backend API: http://localhost:8000

---

**Happy Job Hunting! 🚀**
