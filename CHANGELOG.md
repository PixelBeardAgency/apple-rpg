# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 2: Core Features (Planned)
- Supabase database schema implementation
- User authentication system with Supabase Auth
- Task CRUD operations
- XP calculation and leveling system
- Progress bars in header and profile

### Phase 3: Achievements & Labels (Planned)
- Achievement system with 10 unlockable achievements
- Custom label management
- Task filtering by labels
- Toast notifications for achievements

### Phase 4: UI Polish (Planned)
- Fantasy RPG aesthetic with deep blues/greens
- Pixel-art style icons
- Dark and light mode themes
- Interactive first-login tutorial
- Task completion history page

### Phase 5: Deployment (Planned)
- Vercel deployment configuration
- Production environment setup
- Performance optimization

---

## [0.1.0] - 2025-10-27

### Added - Project Foundation (Phase 1)

#### Project Structure
- Monorepo architecture with frontend and backend workspaces
- Root workspace package.json with concurrent development scripts
- Frontend workspace using React 18 + Vite
- Backend workspace using Express.js + Supabase
- VS Code workspace configuration with recommended settings

#### Documentation Suite
- **PRD** (`docs/rpg-todo.md`) - Complete product requirements document
- **Implementation Plan** (`docs/implementation-plan.md`) - Detailed 5-phase development roadmap
- **Project Memory** (`docs/project-memory.md`) - Critical MUST DO / MUST NOT DO checklist
- **Q&A Log** (`docs/qa-log.md`) - 10 learning-focused questions and answers
- **Setup Summary** (`docs/setup-complete.md`) - Phase 1 completion summary
- **README.md** - Comprehensive project overview with features, tech stack, and setup instructions
- **CONTRIBUTING.md** - Contribution guidelines and code standards
- **CHANGELOG.md** - This version history document

#### Development Environment
- EditorConfig for consistent code style across editors
- Node version management with .nvmrc (Node 18.18.0)
- Environment variable templates (.env.example)
- Comprehensive .gitignore patterns
- ISC License file

#### Frontend Dependencies
- React 18.3.1 with React Router 6.22.3
- Vite 5.2.0 for build tooling
- Supabase client 2.39.8 for auth and database
- Tanstack Query 5.28.4 for data fetching
- Tailwind CSS 3.4.1 for styling
- Lucide React 0.344.0 for icons
- ESLint with React plugins for code quality

#### Backend Dependencies
- Express 4.18.3 web framework
- Supabase client 2.39.8 for database operations
- CORS 2.8.5 for cross-origin requests
- Dotenv 16.4.5 for environment variables
- Nodemon 3.1.0 for development hot reload

#### Project Goals Defined
- **XP System**: Exponential progression with 20 levels using formula `XP = 100 * (level ^ 1.5)`
- **Fixed XP Values**: High=100, Medium=50, Low=25
- **Achievements**: 10 unlockable achievements with bonus XP rewards
- **Labels**: Unlimited custom labels with 4 defaults (Work, Personal, Errands, Goals)
- **UI/UX**: Fantasy RPG aesthetic with dark/light modes and interactive tutorial
- **Progress Tracking**: Progress bars in both header and profile page
- **History**: Complete task completion history with XP earned

### Infrastructure
- Workspace scripts for concurrent frontend/backend development
- npm workspaces configuration for monorepo management
- Placeholder files for frontend (main.jsx) and backend (server.js)

---

## Legend

- **Added** - New features or functionality
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be-removed features
- **Removed** - Removed features or functionality
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes
- **Infrastructure** - Build, deployment, or tooling changes
- **Documentation** - Documentation-only changes

---

**Note**: Version 0.1.0 represents the initial project setup and foundation. Development of core features begins in Phase 2.

