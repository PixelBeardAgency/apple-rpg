# RPG Todo - Questions & Answers Log

**Purpose:** This document tracks project-specific questions and answers that have learning value. Only meaningful questions that would be helpful to review later are included here.

**Last Updated:** October 27, 2025

---

## Q1: Should we use a monorepo or separate repositories for frontend and backend?

**Asked:** October 27, 2025  
**Context:** Planning project structure before development starts

**Answer:**  
Using a **monorepo structure** with both frontend and backend in the same repository.

**Reasoning:**
- Easier to keep frontend and backend in sync
- Simpler to share types/interfaces between layers
- Easier deployment configuration
- Standard practice for full-stack applications of this size
- Single repository for version control

**Structure:**
```
/rpg-todo
  /frontend     # React + Vite
  /backend      # Express.js
  /docs         # Documentation
  package.json  # Root workspace config
```

---

## Q2: Which authentication strategy should we use?

**Asked:** October 27, 2025  
**Context:** PRD mentions authentication but doesn't specify implementation approach

**Answer:**  
Using **Supabase Auth** (built-in authentication service).

**Reasoning:**
- Already using Supabase for database (PostgreSQL)
- Built-in auth system means no additional service needed
- Handles JWT tokens, session management, password hashing automatically
- Simple integration with both frontend and backend
- Meets all PRD requirements for registration/login/profiles
- No need for custom JWT implementation or third-party service (Auth0, Clerk, etc.)

**What Supabase Auth Provides:**
- User registration with email/password
- Login authentication
- JWT token generation and validation
- Session management
- Password reset functionality
- Email verification (if needed later)

---

## Q3: What's the recommended development approach for this project?

**Asked:** October 27, 2025  
**Context:** Determining the best order to build features

**Answer:**  
**Core features first, then enhancements** approach.

**Development Order:**
1. **Phase 1**: Project setup + Database schema + Supabase Auth + Basic Express API
2. **Phase 2**: Task CRUD + XP calculation + Level system
3. **Phase 3**: Achievement system + Custom labels
4. **Phase 4**: UI polish (dark mode, tutorial, tooltips, pixel-art icons, themes)
5. **Phase 5**: Deployment preparation

**Reasoning:**
- Ensures working core functionality quickly
- Can test game mechanics (XP, leveling) early
- Can validate critical requirements before polish
- Allows systematic layering of features
- Reduces risk of incomplete core features

**Why Not Full Vertical Slice?**
- Too complex to build auth → tasks → XP → achievements → UI all at once
- Hard to test individual systems
- Risky if we run into blockers

**Why Not Backend First?**
- Can't demo progress without frontend
- Hard to validate UX requirements without seeing UI

---

## Q4: Should we set up deployment from the start or focus on local development?

**Asked:** October 27, 2025  
**Context:** Need to set up Supabase and Vercel accounts first

**Answer:**  
**Focus on local development first**, but build everything to be deployment-ready.

**Reasoning:**
- Can't deploy without Supabase and Vercel accounts set up
- Can make faster progress developing locally
- Will structure everything with proper env vars and configs so deployment is smooth when ready

**What "Deployment-Ready" Means:**
- Use environment variables for all secrets (Supabase URL, keys, etc.)
- Create `.env.example` template
- Structure backend to work as Vercel serverless functions
- Keep frontend build optimized for production
- Document deployment steps in README

**When to Deploy:**
- After accounts are set up (Supabase + Vercel)
- After core features are working locally (Phases 1-3)
- Include deployment as Phase 5 of development

---

## Q5: Why use the exponential formula `XP = 100 * (level ^ 1.5)` specifically?

**Asked:** October 27, 2025  
**Context:** Understanding the leveling system design

**Answer:**  
This formula provides **balanced exponential growth** that's challenging but achievable.

**Formula Breakdown:**
- Base of 100 XP per level keeps numbers manageable
- Exponent of 1.5 provides exponential growth (not linear)
- Level 1 starts at 100 XP (easily achievable)
- Level 20 caps at ~9,000 XP (requires commitment but attainable)

**Why Exponential Growth Matters:**
- PRD explicitly requires exponential (not linear) progression
- Linear would make higher levels too easy (boring)
- Too steep exponential would make higher levels impossible (frustrating)
- 1.5 exponent is a "sweet spot" for gamification

**Example Progression:**
- Complete 1 high-priority task (100 XP) → Level 1 ✅
- Complete 2 more high-priority tasks (300 XP total) → Level 2 ✅
- Continue pattern, higher levels require more effort
- Achievements provide bonus XP to help progression

**Why Not Other Formulas?**
- Linear (e.g., `level * 100`) = too easy, doesn't meet PRD requirement
- Too steep (e.g., `level ^ 2`) = higher levels become impossible
- Too shallow (e.g., `level ^ 1.2`) = doesn't feel exponential enough

---

## Q6: How do achievement bonus XP and task XP interact?

**Asked:** October 27, 2025  
**Context:** Understanding the XP system mechanics

**Answer:**  
Achievement bonus XP is **added on top of** task completion XP.

**Example Scenario:**
1. User completes their 5th task (High Priority)
2. Task XP: 100 XP (for high priority completion)
3. Achievement unlocked: "Task Creator I"
4. Achievement bonus XP: 50 XP
5. **Total XP earned: 150 XP** (100 + 50)

**Key Points:**
- Achievements don't replace task XP, they supplement it
- Multiple achievements can unlock from one action (e.g., completing 5th high-priority task might unlock both "Task Creator I" AND "High Priority Master")
- Each achievement awards bonus XP once (not repeatable)
- Bonus XP contributes to leveling up
- This is a critical PRD requirement: **NEVER skip achievement bonus XP**

**Why This Design?**
- Makes achievements feel rewarding
- Provides XP boost to help level progression
- Motivates users to pursue achievements
- Adds depth to the gamification system

---

## Q7: What happens when a user deletes a custom label?

**Asked:** October 27, 2025  
**Context:** Understanding label management behavior

**Answer:**  
When a label is deleted, it is **removed from all tasks** it was assigned to, with user confirmation.

**Delete Flow:**
1. User clicks delete on a label
2. System shows confirmation dialog: "This will remove [Label Name] from all tasks. Continue?"
3. If user confirms:
   - Label is deleted from `labels` table
   - All entries in `task_labels` junction table for this label are deleted (cascade)
   - Tasks themselves remain, just lose this label
4. If user cancels, nothing happens

**Why This Design?**
- PRD requires confirmation before deletion
- Prevents accidental data loss
- Makes it clear that deletion affects multiple tasks
- Maintains referential integrity in database

**Database Implementation:**
```sql
-- Foreign key with CASCADE
task_labels (
  label_id uuid REFERENCES labels(id) ON DELETE CASCADE
)
```

**Default Labels:**
- Work, Personal, Errands, Goals are seeded as default
- Can be deleted by users (they're not special/protected)
- If deleted, they won't re-appear unless database is re-seeded

---

## Q8: Why are progress bars required in BOTH header AND profile page?

**Asked:** October 27, 2025  
**Context:** Understanding UI requirements

**Answer:**  
This is a **critical PRD requirement** to ensure XP progress is always visible to users.

**Header Progress Bar:**
- Always visible as user navigates app
- Provides constant reminder of progress
- Motivates users to complete tasks (see bar filling up)
- Quick reference without navigating away

**Profile Progress Bar:**
- More detailed view of XP/level
- Can show additional info (exact XP numbers, next level requirements)
- Part of overall profile context (achievements, bio, etc.)
- Users expect to see progression details in profile

**Why Both?**
- Different contexts serve different purposes
- Header = quick glance, always present
- Profile = detailed view, intentional navigation
- Gamification best practice: make progress visible everywhere
- PRD explicitly states "in the profile and website header" → both required

**What NOT to Do:**
- ❌ Only implement one location (violates PRD)
- ❌ Make one location optional
- ❌ Hide progress bar on certain pages

---

## Q9: Can users create more than 10 custom labels?

**Asked:** October 27, 2025  
**Context:** Clarifying label limits

**Answer:**  
**Yes, unlimited custom labels are allowed.** There is no cap.

**Key Points:**
- PRD explicitly states "Allow unlimited custom labels"
- This is a critical "MUST NOT DO" requirement: **NEVER limit custom labels**
- Users can create 10, 50, 100, or 1000+ labels if they want
- Only 10 achievements exist, but labels are unlimited

**Why Unlimited?**
- Different users have different organizational needs
- Some users might have complex workflows requiring many categories
- No technical reason to limit
- PRD is explicit about this requirement

**UI Considerations:**
- Label dropdown might need search/filter for users with many labels
- Consider pagination or virtualization if user has 100+ labels
- But don't prevent creation of new labels

**Achievement Note:**
- "Label Creator I" achievement is for creating 3 labels
- No achievements for creating 5 or 10 labels (only for creating tasks)
- This is intentional per PRD

---

## Q10: What's the difference between "User" role in the PRD and guest users?

**Asked:** October 27, 2025  
**Context:** Understanding user types and permissions

**Answer:**  
The PRD mentions two user types: **Guest** and **User**, but only **User** role needs to be implemented.

**User Role:**
- Registered users who have created an account
- Full permissions to use all features
- Can create, edit, delete tasks
- Can earn XP, level up, unlock achievements
- Can create custom labels
- Can customize profile

**Guest Role:**
- Mentioned in PRD but not defined
- Likely means "not logged in"
- No implementation required for MVP
- Guests would only see login/register page

**Implementation:**
- Single role system: "User"
- All registered users have same permissions
- No admin role, no guest functionality beyond login page
- Keep it simple per PRD requirements

**Why Only One Role?**
- PRD states "Implement a single 'User' role with permissions to fully utilize the application"
- No mention of different permission levels
- No admin features required
- Guests are just unauthenticated users (handled by auth system)

---

**End of Q&A Log**

*This document will be updated as new learning-worthy questions arise during development.*
