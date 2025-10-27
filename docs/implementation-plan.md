# RPG Todo - Implementation Plan

**Last Updated:** October 27, 2025

## Project Overview

Building a gamified task management web application where users earn XP for completing tasks, level up (max level 20), unlock achievements, and organize tasks with custom labels. This is a full-stack monorepo with React frontend, Express backend, Supabase database/auth, deployed to Vercel.

## Architecture

### Monorepo Structure
```
/rpg-todo
  /frontend          # React + Vite + Shadcn + Tailwind
  /backend           # Express.js API
  /docs              # Documentation (PRD, plans, Q&A)
  package.json       # Root workspace config
  .gitignore         # Git ignore patterns
```

### Tech Stack
- **Frontend**: React 18, Vite, Shadcn UI, Tailwind CSS, React Router, Tanstack Query
- **Backend**: Express.js, Supabase client, CORS, dotenv
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (handles registration, login, JWT tokens)
- **Deployment**: Vercel (frontend + serverless functions for backend)

---

## Critical Requirements (from PRD)

### ✅ MUST DO

- **Exponential XP requirements** for 20 levels (seeded in DB) - Formula: `XP = 100 * (level ^ 1.5)`
- **Fixed XP values**: High=100 XP, Medium=50 XP, Low=25 XP (never change these)
- **10 achievements** seeded in database with bonus XP rewards
- **Default labels** seeded: Work, Personal, Errands, Goals
- **Display ALL achievements** from start with locked/unlocked UI state
- **Toast notifications** when achievements are unlocked
- **Progress bars** in BOTH header AND profile page (not just one)
- **Task completion history** page with: title, completion date, priority, XP earned, labels
- **Interactive first-login tutorial** covering: task creation, priority, XP, labels, achievements page
- **Fantasy RPG aesthetic**: deep blues/greens color palette, pixel-art style icons
- **Dark + Light mode** themes (both required)
- **Tooltips** on task form fields and achievement descriptions
- **Task filtering** by multiple labels (multi-select)
- **Unlimited custom labels** with full management UI (create/edit/delete with confirmation)
- **User role system**: single "User" role with full permissions

### ❌ MUST NOT DO

- ❌ **Linear level progression** (must be exponential)
- ❌ **Limit custom labels** (must be unlimited)
- ❌ **Skip achievement bonus XP** (achievements must award bonus XP)
- ❌ **Hide unearned achievements** (all must be visible from start)
- ❌ **Use different XP values** (must be 100/50/25)
- ❌ **Skip seeding data** (levels, achievements, labels all required)
- ❌ **Skip tutorial or toast notifications**
- ❌ **Only one progress bar location** (must be in header AND profile)

---

## Implementation Phases

### Phase 1: Project Foundation & Database
**Status:** 🚧 In Progress  
**Goal:** Set up monorepo, Supabase schema, basic Express API

#### Files to Create
- ✅ `/package.json` - Root workspace with frontend/backend
- ✅ `/frontend/` - Vite + React scaffold with Shadcn
- ✅ `/backend/` - Express server with Supabase client
- ✅ `/docs/implementation-plan.md` - This document
- ✅ `/docs/project-memory.md` - Critical TODO/NOT-TO-DO list
- ✅ `/docs/qa-log.md` - Questions & answers log
- ⏳ `/backend/db/schema.sql` - Database schema
- ⏳ `/backend/db/seed.js` - Seed script for levels/achievements/labels

#### Database Schema

**Users Table** (extends Supabase auth.users)
```sql
users (
  id: uuid PRIMARY KEY (FK to auth.users)
  username: text UNIQUE NOT NULL
  bio: text
  profile_picture_url: text
  total_xp: integer DEFAULT 0
  current_level: integer DEFAULT 1
  tutorial_completed: boolean DEFAULT false
  created_at: timestamp DEFAULT now()
)
```

**Levels Table** (seeded with 20 levels)
```sql
levels (
  level_number: integer PRIMARY KEY
  xp_required: integer NOT NULL
)
```

**Tasks Table**
```sql
tasks (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  user_id: uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
  title: text NOT NULL
  description: text
  priority: text CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW'))
  due_date: timestamp
  is_completed: boolean DEFAULT false
  completed_at: timestamp
  xp_earned: integer
  created_at: timestamp DEFAULT now()
)
```

**Labels Table**
```sql
labels (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  user_id: uuid REFERENCES users(id) ON DELETE CASCADE
  name: text NOT NULL
  is_default: boolean DEFAULT false
  created_at: timestamp DEFAULT now()
)
```

**Task_Labels Junction Table**
```sql
task_labels (
  task_id: uuid REFERENCES tasks(id) ON DELETE CASCADE
  label_id: uuid REFERENCES labels(id) ON DELETE CASCADE
  PRIMARY KEY (task_id, label_id)
)
```

**Achievements Table** (seeded with 10 achievements)
```sql
achievements (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4()
  name: text NOT NULL
  description: text NOT NULL
  criteria_type: text NOT NULL
  criteria_value: integer NOT NULL
  bonus_xp: integer NOT NULL
  icon: text
  created_at: timestamp DEFAULT now()
)
```

**User_Achievements Table**
```sql
user_achievements (
  user_id: uuid REFERENCES users(id) ON DELETE CASCADE
  achievement_id: uuid REFERENCES achievements(id) ON DELETE CASCADE
  earned_at: timestamp DEFAULT now()
  PRIMARY KEY (user_id, achievement_id)
)
```

#### Seed Data

**20 Levels with Exponential XP**
```javascript
// Formula: XP = 100 * (level ^ 1.5)
Level 1:  100 XP
Level 2:  283 XP
Level 3:  520 XP
Level 4:  800 XP
Level 5:  1,118 XP
Level 6:  1,470 XP
Level 7:  1,853 XP
Level 8:  2,263 XP
Level 9:  2,700 XP
Level 10: 3,162 XP
Level 11: 3,648 XP
Level 12: 4,157 XP
Level 13: 4,688 XP
Level 14: 5,241 XP
Level 15: 5,814 XP
Level 16: 6,406 XP
Level 17: 7,018 XP
Level 18: 7,648 XP
Level 19: 8,296 XP
Level 20: 8,944 XP (max level)
```

**10 Achievements**
1. **Task Creator I** - Create 5 tasks (50 bonus XP)
2. **Task Creator II** - Create 10 tasks (100 bonus XP)
3. **Task Creator III** - Create 20 tasks (200 bonus XP)
4. **High Priority Master** - Complete 1 high priority task (75 bonus XP)
5. **Medium Priority Master** - Complete 1 medium priority task (50 bonus XP)
6. **Low Priority Master** - Complete 1 low priority task (25 bonus XP)
7. **Level 5 Achiever** - Reach level 5 (150 bonus XP)
8. **Level 10 Achiever** - Reach level 10 (300 bonus XP)
9. **Level 15 Achiever** - Reach level 15 (500 bonus XP)
10. **Label Creator I** - Create 3 custom labels (75 bonus XP)

**4 Default Labels**
- Work
- Personal
- Errands
- Goals

---

### Phase 2: Core Features - Auth, Tasks, XP
**Status:** ⏳ Not Started  
**Goal:** Working task management with XP/leveling system

#### Backend APIs (`/backend/routes/`)
- `POST /api/auth/register` - Create user with Supabase Auth
- `POST /api/auth/login` - Login with Supabase Auth
- `GET /api/tasks` - Get user's tasks (with optional label filters)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark complete, calculate XP, check level up, check achievements
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/profile` - Get user profile with level/XP
- `PATCH /api/profile` - Update profile (bio, picture)
- `GET /api/levels` - Get all levels

#### Frontend Pages (`/frontend/src/pages/`)
- `Login.tsx` - Login/register form (Shadcn components)
- `Dashboard.tsx` - Main view with task list, filters, create button
- `Profile.tsx` - User profile with XP progress, bio, picture

#### Key Logic
- **XP Calculation**: Priority-based (HIGH=100, MEDIUM=50, LOW=25)
- **Level Up Check**: Compare user's total_xp to levels.xp_required
- **Level Up Process**: Update user's current_level, show celebration, check for level achievements

---

### Phase 3: Achievements & Labels
**Status:** ⏳ Not Started  
**Goal:** Achievement system with notifications, custom label management

#### Backend APIs
- `GET /api/achievements` - Get all achievements with user's earned status
- `POST /api/labels` - Create custom label
- `PATCH /api/labels/:id` - Edit label name
- `DELETE /api/labels/:id` - Delete label (with confirmation, removes from all tasks)
- `GET /api/labels` - Get user's labels + default labels

#### Achievement Triggers (`/backend/services/achievementService.js`)
- **On task creation**: Check task count milestones (5, 10, 20)
- **On task completion**: Check priority completion badges
- **On level up**: Check level milestones (5, 10, 15, 20)
- **On label creation**: Check label count milestones (3, 5, 10)
- **Award bonus XP** when achievement unlocked
- **Trigger toast notification** via response flag

#### Frontend Components (`/frontend/src/components/`)
- `AchievementToast.tsx` - Toast notification with icon when achievement earned
- `AchievementList.tsx` - Display all achievements (locked/unlocked state)
- `LabelManager.tsx` - Create/edit/delete labels in task creation modal
- `TaskFilters.tsx` - Multi-select label filter dropdown

---

### Phase 4: UI Polish & Tutorial
**Status:** ⏳ Not Started  
**Goal:** RPG aesthetic, dark/light modes, tooltips, first-login tutorial

#### Design System (`/frontend/src/styles/`)
- Tailwind config with deep blue/green color palette
- Custom Shadcn theme overrides for RPG feel
- Pixel-art icon integration (game-icons.net or custom SVGs)

#### UI Components
- `ThemeToggle.tsx` - Dark/light mode switcher (persistent)
- `ProgressBar.tsx` - XP progress component (used in header AND profile)
- `Tooltip.tsx` - Wrapper component for form fields and achievements
- `Tutorial.tsx` - Interactive walkthrough modal (Shadcn Dialog with steps)

#### Tutorial Flow
1. **Welcome** - RPG-themed greeting, explain gamification concept
2. **Task Creation** - Show how to create task (title, description, priority)
3. **XP System** - Explain XP earning (100/50/25 for H/M/L)
4. **Custom Labels** - Demo label creation and assignment
5. **Achievements** - Point to achievements page location
6. **Complete** - Mark user.tutorial_completed = true

#### Task History Page (`/frontend/src/pages/History.tsx`)
- Table/list of completed tasks
- Columns: Title, Completed Date, Priority, XP Earned, Labels
- Sort by completion date (most recent first)
- Pagination if needed

---

### Phase 5: Deployment Preparation
**Status:** ⏳ Not Started  
**Goal:** Ready to deploy to Vercel when Supabase/Vercel accounts are set up

#### Configuration Files
- `/vercel.json` - Vercel config for frontend + serverless backend
- `/backend/vercel.json` - API routes as serverless functions
- `.env.example` - Template for required environment variables
- `README.md` - Setup and deployment instructions

#### Environment Variables
```env
# Supabase
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Backend
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

#### Deployment Steps (when ready)
1. **Create Supabase project** - Set up database, run migrations, seed data
2. **Create Vercel project** - Link GitHub repo
3. **Add environment variables** - In Vercel dashboard
4. **Deploy** - Push to main branch, Vercel auto-deploys
5. **Test** - Verify all features work in production

---

## Key Files & Responsibilities

### Backend Core
- `/backend/server.js` - Express app setup, middleware, routes
- `/backend/middleware/auth.js` - Supabase JWT verification
- `/backend/services/xpService.js` - XP calculation, level up logic
- `/backend/services/achievementService.js` - Achievement checking and awarding
- `/backend/db/seed.js` - Seed levels, achievements, default labels
- `/backend/db/schema.sql` - Database schema definition

### Frontend Core
- `/frontend/src/App.tsx` - Router setup, auth provider
- `/frontend/src/contexts/AuthContext.tsx` - Supabase auth state management
- `/frontend/src/hooks/useTasks.js` - Tanstack Query for task operations
- `/frontend/src/hooks/useAchievements.js` - Achievement fetching
- `/frontend/src/components/layout/Header.tsx` - Header with progress bar

---

## Testing Strategy

- **Manual testing** for each feature phase before moving to next
- **Achievement triggers** - Test all 10 achievement unlock conditions
- **Label deletion** - Verify cascade removal from tasks
- **XP calculation** - Verify 100/50/25 for H/M/L priorities
- **Exponential leveling** - Verify level progression uses formula correctly
- **Tutorial flow** - Test first-login experience for new users
- **Dark/Light modes** - Verify theme switching works across all pages
- **Toast notifications** - Verify achievement unlocks show toasts

---

## Development Progress

### Completed ✅
1. ✅ Documentation structure (implementation-plan, project-memory, qa-log)
2. ✅ Monorepo initialization

### In Progress 🚧
- Nothing currently

### Not Started ⏳
1. ⏳ Supabase schema + seed data
2. ⏳ Basic Express API + auth endpoints
3. ⏳ React scaffold + Shadcn setup
4. ⏳ Task CRUD + XP system
5. ⏳ Level up logic + progress bars
6. ⏳ Achievement system + toast notifications
7. ⏳ Custom labels + filtering
8. ⏳ UI theming (dark/light) + RPG aesthetic
9. ⏳ Tutorial system
10. ⏳ Task history page
11. ⏳ Deployment configuration
12. ⏳ Final testing and polish

---

## Notes & Decisions

### Why Supabase Auth?
- Built-in with Supabase (our database choice)
- Handles JWT tokens, session management, password hashing
- Simple integration, no need for separate auth service
- Meets all PRD requirements for registration/login

### Why Monorepo?
- Single repository for version control simplicity
- Frontend and backend stay in sync
- Easier to share types/interfaces between layers
- Simpler deployment setup

### Why Exponential XP Formula?
- PRD explicitly requires exponential (not linear) progression
- Formula `XP = 100 * (level ^ 1.5)` provides good balance
- Keeps game challenging and rewarding
- Level 20 at ~9,000 XP is achievable but requires commitment

---

**End of Implementation Plan**

