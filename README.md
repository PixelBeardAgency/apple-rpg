<div align="center">

# ⚔️ RPG Todo ⚔️

### Level Up Your Productivity

*A gamified task management application with RPG-style progression*

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Phase](https://img.shields.io/badge/phase-1%3A%20foundation-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-18.18.0-brightgreen)

</div>

---

## 📖 Overview

A full-stack web application that transforms task management into an RPG-style adventure. Complete tasks, earn XP, level up, unlock achievements, and organize your life with custom labels!

## 🎮 Features

- **Gamified Task Management**: Complete tasks to earn XP and level up
- **RPG Progression System**: 20 levels with exponential XP requirements
- **Achievement System**: 10 unlockable achievements with bonus XP rewards
- **Custom Labels**: Unlimited custom labels for task organization
- **Task Filtering**: Filter tasks by multiple labels
- **Progress Tracking**: View XP progress in header and profile page
- **Task History**: Complete history of finished tasks with XP earned
- **Fantasy RPG Aesthetic**: Deep blues/greens palette with pixel-art icons
- **Dark & Light Modes**: Toggle between themes
- **Interactive Tutorial**: First-login walkthrough for new users
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite
- Shadcn UI
- Tailwind CSS
- React Router
- Tanstack Query
- Supabase Client

### Backend
- Express.js
- Supabase (PostgreSQL)
- Supabase Auth (JWT)

### Deployment
- Vercel (Frontend + Serverless Functions)
- Supabase (Database + Auth)

## 📁 Project Structure

```
rpg-todo/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
├── backend/            # Express backend API
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── db/
│   └── package.json
├── docs/               # Documentation
│   ├── rpg-todo.md            # PRD
│   ├── implementation-plan.md  # Implementation plan
│   ├── project-memory.md       # Critical requirements
│   └── qa-log.md               # Q&A log
└── package.json        # Root workspace config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rpg-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and fill in your Supabase credentials
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the schema migrations from `/backend/db/schema.sql`
   - Run the seed script: `npm run seed --workspace=backend`

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:5173) and backend (http://localhost:3000)

## 🎯 XP & Leveling System

### XP Values by Priority
- **High Priority**: 100 XP
- **Medium Priority**: 50 XP
- **Low Priority**: 25 XP

### Level Progression
Exponential formula: `XP = 100 * (level ^ 1.5)`

- Level 1: 100 XP
- Level 5: 1,118 XP
- Level 10: 3,162 XP
- Level 15: 5,814 XP
- Level 20: 8,944 XP (max level)

## 🏆 Achievements

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

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get user's tasks (with optional label filters)
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark task complete (awards XP)
- `DELETE /api/tasks/:id` - Delete task

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

### Labels
- `GET /api/labels` - Get user's labels
- `POST /api/labels` - Create new label
- `PATCH /api/labels/:id` - Edit label
- `DELETE /api/labels/:id` - Delete label

### Achievements
- `GET /api/achievements` - Get all achievements with earned status

### Levels
- `GET /api/levels` - Get all levels

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build --workspace=frontend`
3. Set output directory: `frontend/dist`
4. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### Backend (Vercel Serverless Functions)
1. Configure `vercel.json` for API routes
2. Add backend environment variables

### Database (Supabase)
1. Create production Supabase project
2. Run migrations
3. Run seed script
4. Update environment variables with production credentials

## 📚 Documentation

- **PRD**: [`/docs/rpg-todo.md`](docs/rpg-todo.md) - Full product requirements
- **Implementation Plan**: [`/docs/implementation-plan.md`](docs/implementation-plan.md) - Detailed development plan
- **Project Memory**: [`/docs/project-memory.md`](docs/project-memory.md) - Critical requirements checklist
- **Q&A Log**: [`/docs/qa-log.md`](docs/qa-log.md) - Common questions and answers
- **Setup Summary**: [`/docs/setup-complete.md`](docs/setup-complete.md) - Phase 1 completion status
- **Changelog**: [`CHANGELOG.md`](CHANGELOG.md) - Version history and updates

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Supabase Row Level Security (RLS) policies should be enabled
- JWT tokens handled by Supabase Auth

## 🤝 Contributing

This is a personal project for evaluation purposes. Not accepting external contributions at this time.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and code standards.

## 📄 License

ISC

---

**Built with ❤️ and a lot of XP**

