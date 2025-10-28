# Phase 2 Setup Instructions

🎉 **Core backend and frontend code is complete!** Here's how to get everything running.

---

## ✅ What's Been Built

### Backend (Complete)
- ✅ Express server with all routes
- ✅ Authentication middleware
- ✅ XP service with exponential leveling
- ✅ Achievement service
- ✅ Database schema SQL file
- ✅ Seed script (20 levels, 10 achievements, 4 labels)
- ✅ All API endpoints (auth, tasks, profile, labels, achievements, levels)

### Frontend (Complete)
- ✅ React app with Vite
- ✅ Tailwind CSS configured
- ✅ Authentication context
- ✅ React Query hooks for data fetching
- ✅ Login & Register pages
- ✅ Dashboard with task management
- ✅ Profile page with progress bar
- ✅ Header with progress bar (BOTH locations as required!)

---

## 🚀 Setup Steps

### Step 1: Set Up Supabase Database

1. **Go to your Supabase project dashboard**: https://app.supabase.com
   - Your project URL: `https://jybemmiuwmagbewtfdqu.supabase.co`

2. **Run the Database Schema**:
   - In Supabase dashboard, go to **SQL Editor**
   - Click **"New query"**
   - Copy the entire contents of `/backend/src/db/schema.sql`
   - Paste into the SQL editor
   - Click **"Run"** to create all tables, RLS policies, and triggers

3. **Verify Tables Created**:
   - Go to **Table Editor** in Supabase
   - You should see: `users`, `levels`, `tasks`, `labels`, `task_labels`, `achievements`, `user_achievements`

### Step 2: Create Environment Files

The `.env` files are gitignored for security. You need to create them manually:

**Backend** (`/backend/.env`):
```env
SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTcyMTQsImV4cCI6MjA3NzIzMzIxNH0.S-Zru90PKqJC8fApbZnfptEbHHSN8OzT2QR4PQnTLT4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY1NzIxNCwiZXhwIjoyMDc3MjMzMjE0fQ.PhIvokRvtqHY_Ew0VyNWc-byL2bDu-kwRZr0BTxXCDI
PORT=3000
NODE_ENV=development
```

**Frontend** (`/frontend/.env`):
```env
VITE_SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTcyMTQsImV4cCI6MjA3NzIzMzIxNH0.S-Zru90PKqJC8fApbZnfptEbHHSN8OzT2QR4PQnTLT4
```

### Step 3: Seed the Database

Run the seed script to populate levels, achievements, and default labels:

```bash
cd backend
npm run seed
```

You should see:
```
🌱 Starting database seed...
📊 Seeding 20 levels with exponential XP...
✅ Seeded 20 levels successfully
🏆 Seeding 10 achievements...
✅ Seeded 10 achievements successfully
🏷️  Seeding 4 default labels...
✅ Seeded 4 default labels successfully
✅ Database seed completed successfully! 🎉
```

### Step 4: Install Dependencies (If Not Already Done)

```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 5: Run the Application

Open **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Should show: `🚀 RPG Todo API running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Should show: `Local: http://localhost:5173`

### Step 6: Test the Application

1. **Open browser** to `http://localhost:5173`
2. **Register** a new account
   - Enter username, email, password
   - You'll be automatically logged in
3. **Create a task**
   - Click "Create Task"
   - Set priority (High = 100 XP, Medium = 50 XP, Low = 25 XP)
   - Click "Create Task"
4. **Complete the task**
   - Click the green checkmark
   - Watch your XP increase!
5. **Check progress bars**
   - Header: Progress bar should show your level progress
   - Profile page: Progress bar should show detailed XP info
6. **Verify XP values**
   - HIGH priority = +100 XP
   - MEDIUM priority = +50 XP
   - LOW priority = +25 XP

---

## 🧪 Critical Features to Test

### ✅ MUST Verify (Phase 2 Requirements)

1. **User can register and login** ✓
2. **User can create tasks with priorities** ✓
3. **Completing HIGH task awards exactly 100 XP** ✓
4. **Completing MEDIUM task awards exactly 50 XP** ✓
5. **Completing LOW task awards exactly 25 XP** ✓
6. **Level 1 requires 100 XP** ✓
7. **Progress bars appear in BOTH header AND profile** ✓
8. **User profile displays correctly** ✓

### Test Leveling System

Create and complete tasks to test exponential leveling:
- Level 1 → 2: Need 283 XP total (3 high-priority tasks)
- Level 2 → 3: Need 520 XP total (5-6 high-priority tasks)
- Verify level-ups happen at correct XP thresholds

---

## 📁 Project Structure

```
/backend/src/
├── server.js                    # Express server
├── middleware/
│   └── auth.js                  # JWT authentication
├── services/
│   ├── xpService.js             # XP calculation & leveling
│   └── achievementService.js    # Achievement checking
├── routes/
│   ├── auth.js                  # Registration & login
│   ├── tasks.js                 # Task CRUD + completion
│   ├── profile.js               # User profile
│   ├── labels.js                # Custom labels
│   ├── achievements.js          # Achievements list
│   └── levels.js                # Level data
└── db/
    ├── schema.sql               # Database schema
    └── seed.js                  # Seed script

/frontend/src/
├── main.jsx                     # App entry point
├── App.jsx                      # Routing
├── components/
│   └── layout/
│       ├── Header.jsx           # Header with progress bar
│       └── Layout.jsx           # Page wrapper
├── pages/
│   ├── Login.jsx                # Login page
│   ├── Register.jsx             # Registration page
│   ├── Dashboard.jsx            # Task list
│   └── Profile.jsx              # User profile with progress bar
├── contexts/
│   └── AuthContext.jsx          # Authentication state
├── hooks/
│   ├── useTasks.js              # Task data fetching
│   └── useProfile.js            # Profile data fetching
└── lib/
    ├── supabase.js              # Supabase client
    └── utils.js                 # Utility functions
```

---

## 🎯 What's Next (Phase 3 & 4)

### Phase 3: Achievements & Labels
- [ ] Achievement toast notifications
- [ ] Custom label creation UI
- [ ] Task filtering by multiple labels
- [ ] Achievement triggers (currently built but not UI)

### Phase 4: UI Polish
- [ ] Dark/Light mode toggle
- [ ] Fantasy RPG aesthetic (deep blues/greens)
- [ ] Pixel-art icons
- [ ] Interactive tutorial
- [ ] Task completion history page
- [ ] Tooltips on form fields

---

## 🔧 Troubleshooting

### "Cannot connect to Supabase"
- Verify `.env` files exist in `/backend` and `/frontend`
- Check Supabase project is active
- Verify API keys are correct

### "Tables not found"
- Run the schema.sql in Supabase SQL Editor
- Check Table Editor to confirm tables exist

### "No levels in database"
- Run `npm run seed` in backend directory
- Check Supabase Table Editor → `levels` table should have 20 rows

### "RLS policy error"
- The schema.sql includes RLS policies
- Make sure the entire schema file was run
- Try running it again if needed

### "CORS error"
- Backend should be running on port 3000
- Frontend should be running on port 5173
- Vite config includes proxy for `/api` routes

---

## ✨ You're All Set!

The app should now be fully functional with:
- ✅ User authentication
- ✅ Task creation and completion
- ✅ XP system (100/50/25 for H/M/L)
- ✅ Exponential leveling (20 levels)
- ✅ Progress bars in header AND profile
- ✅ Database with seeded data

**Next**: Test everything thoroughly, then we can move to Phase 3 for achievements and labels!

---

## 📝 Quick Commands Reference

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev

# Seed database (from /backend)
npm run seed

# Run both (from root)
npm run dev
```

---

**Need help?** Check the console for error messages and verify all setup steps were completed.

