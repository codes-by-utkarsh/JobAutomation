# 🦁 The Beast - Frontend Dashboard

A stunning, premium Next.js dashboard for The Beast autonomous job application platform.

## ✨ Features

- **🎨 Premium UI/UX**: Glassmorphism design with smooth animations
- **🔐 Authentication**: Secure login and registration
- **📊 Real-time Dashboard**: Monitor automation status and statistics
- **👤 Profile Management**: Complete profile and resume management
- **📋 Applications Tracker**: View all submitted applications
- **🚀 Automation Controls**: Start, pause, and stop job hunting

## 🎯 Design Highlights

- **Glassmorphism**: Modern glass-morphic cards with blur effects
- **Premium Gradients**: Vibrant purple, indigo, and cyan color schemes
- **Smooth Animations**: Float, pulse, and transition effects
- **Responsive Design**: Works perfectly on all devices
- **Dark Theme**: Sleek dark mode optimized for long sessions

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
cd dashboard
npm install
\`\`\`

### 2. Configure Environment

The \`.env.local\` file is already configured:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The dashboard will be available at **http://localhost:3000**

## 📁 Project Structure

\`\`\`
dashboard/
├── app/
│   ├── globals.css                 # Global styles & design system
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── register/
│   │   └── page.tsx               # Registration page
│   └── dashboard/
│       ├── page.tsx               # Main dashboard
│       ├── profile/
│       │   └── page.tsx           # Profile management
│       └── applications/
│           └── page.tsx           # Applications tracker
├── .env.local                      # Environment variables
├── package.json                    # Dependencies
└── tailwind.config.ts             # Tailwind configuration
\`\`\`

## 🎨 Design System

### Colors
- **Primary Purple**: `#8b5cf6`
- **Primary Indigo**: `#6366f1`
- **Primary Cyan**: `#06b6d4`
- **Accent Pink**: `#ec4899`
- **Accent Orange**: `#f97316`

### Components
- **Glass Cards**: `.glass-card` - Glassmorphic cards with blur
- **Premium Buttons**: `.btn-primary`, `.btn-secondary`
- **Input Fields**: `.input-field` - Styled form inputs
- **Status Badges**: `.status-badge` with variants
- **Gradient Text**: `.gradient-text`, `.gradient-text-accent`

### Animations
- **Float**: Gentle floating effect for backgrounds
- **Pulse Glow**: Pulsing glow effect for emphasis
- **Shimmer**: Loading shimmer effect
- **Spin**: Loading spinner animation

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:8000`

### Endpoints Used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile/me` - Fetch user profile
- `PUT /api/profile/update` - Update profile
- `POST /api/profile/resume/upload` - Upload resume
- `POST /api/profile/automation/start` - Start automation
- `POST /api/profile/automation/pause` - Pause automation
- `POST /api/profile/automation/stop` - Stop automation

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with animated backgrounds
- Feature showcase
- How it works section
- Call-to-action sections

### Login (`/login`)
- Email and password authentication
- Error handling
- Redirect to dashboard on success

### Register (`/register`)
- User registration with validation
- Password confirmation
- Automatic login after registration

### Dashboard (`/dashboard`)
- Real-time automation status
- Application statistics
- Control panel for automation
- Quick action cards

### Profile (`/dashboard/profile`)
- Resume upload with drag & drop
- Education information
- Job preferences (roles, locations, salary)
- Dynamic tag management

### Applications (`/dashboard/applications`)
- View all applications
- Filter by status
- Application statistics
- External job links

## 🛠️ Development

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

\`\`\`bash
npm start
\`\`\`

### Linting

\`\`\`bash
npm run lint
\`\`\`

## 🎯 Key Features Implementation

### Authentication
- JWT token stored in localStorage
- Protected routes with client-side checks
- Automatic redirect for unauthorized users

### State Management
- React hooks for local state
- localStorage for persistence
- Real-time profile updates

### File Upload
- Drag & drop resume upload
- File type validation (PDF, DOCX)
- Visual feedback for upload status

### Automation Controls
- Start/Pause/Stop automation
- Real-time status updates
- Validation before starting

## 🌟 Premium UX Details

1. **Smooth Page Transitions**: Fade-in effects on page load
2. **Hover Effects**: Cards and buttons respond to hover
3. **Loading States**: Spinners and disabled states during API calls
4. **Error Handling**: User-friendly error messages
5. **Form Validation**: Client-side validation with feedback
6. **Responsive Design**: Mobile-first approach
7. **Accessibility**: Semantic HTML and ARIA labels

## 🚢 Deployment

This Next.js app can be deployed to:
- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**
- **Digital Ocean App Platform**

## 🎨 Customization

All design tokens are defined in `globals.css`:
- Colors: CSS variables in `:root`
- Components: Reusable CSS classes
- Animations: Keyframe definitions

## 📝 Notes

- Ensure the backend is running at `http://localhost:8000`
- Default API URL can be changed in `.env.local`
- All pages use client-side rendering (`'use client'`)
- TypeScript is used for type safety

## 🦁 The Beast is Ready to Hunt!

Start the backend, run the frontend, and unleash the power of automated job applications! 🚀
