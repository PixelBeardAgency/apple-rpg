# RPG Todo - Project Memory

**Critical Requirements Reference**  
**Last Updated:** October 27, 2025

This document contains the most critical "MUST DO" and "MUST NOT DO" requirements extracted from the PRD. Use this as a quick reference during development to ensure nothing critical is missed.

---

## ✅ MUST DO - Critical Requirements

### 1. XP & Leveling System
- ✅ **Exponential XP requirements** for all 20 levels
  - Formula: `XP = 100 * (level ^ 1.5)`
  - Must be seeded in database at startup
- ✅ **Fixed XP values** based on task priority:
  - High Priority: **100 XP**
  - Medium Priority: **50 XP**
  - Low Priority: **25 XP**
  - **NEVER change these values**
- ✅ **Level cap at 20** - no higher levels allowed
- ✅ **Achievement bonus XP** - achievements must award bonus XP on top of task XP

### 2. Achievement System
- ✅ **Exactly 10 achievements** must be seeded in database:
  1. Task Creator I (5 tasks) - 50 bonus XP
  2. Task Creator II (10 tasks) - 100 bonus XP
  3. Task Creator III (20 tasks) - 200 bonus XP
  4. High Priority Master (complete 1 high) - 75 bonus XP
  5. Medium Priority Master (complete 1 medium) - 50 bonus XP
  6. Low Priority Master (complete 1 low) - 25 bonus XP
  7. Level 5 Achiever - 150 bonus XP
  8. Level 10 Achiever - 300 bonus XP
  9. Level 15 Achiever - 500 bonus XP
  10. Label Creator I (3 labels) - 75 bonus XP

- ✅ **Display ALL achievements from start**
  - Show locked/unlocked state
  - Never hide unearned achievements
  - Users should see what they can work toward

- ✅ **Toast notifications** when achievements are unlocked
  - Must include achievement icon
  - Must include achievement name and description
  - Should auto-dismiss after a few seconds

### 3. Progress Bars
- ✅ **Progress bar in HEADER** showing current level and XP progress
- ✅ **Progress bar in PROFILE PAGE** showing current level and XP progress
- ✅ **BOTH locations required** - not just one
- ✅ Progress bars must update dynamically as XP is earned

### 4. Custom Labels
- ✅ **Unlimited custom labels** - no limit on how many users can create
- ✅ **Default labels seeded** in database:
  - Work
  - Personal
  - Errands
  - Goals
- ✅ **Full label management UI** within task creation/edit modal:
  - Create new labels
  - Edit existing labels
  - Delete labels (with confirmation)
- ✅ **Label deletion behavior**: removes label from all tasks it's assigned to
- ✅ **Task filtering by labels**: multi-select support (filter by multiple labels)

### 5. Task Management
- ✅ **Task completion history page** must include:
  - Task title
  - Completion date
  - Priority level
  - XP earned
  - Associated labels
- ✅ **Prioritized task list** on dashboard (High → Medium → Low)
- ✅ Tasks must have: title, description, priority, due date, custom labels

### 6. UI/UX Requirements
- ✅ **Fantasy RPG aesthetic**:
  - Deep blues and greens color palette
  - Pixel-art style icons
  - RPG-themed fonts and borders
- ✅ **Both dark AND light mode themes** required
- ✅ **Tooltips** on:
  - Task creation form fields
  - Achievement descriptions
- ✅ **Interactive first-login tutorial** covering:
  - How to create tasks
  - How to set priority levels
  - How XP system works (100/50/25)
  - How to create and use custom labels
  - Where to find achievements page
- ✅ Tutorial must mark user as `tutorial_completed` when finished

### 7. User System
- ✅ **User registration** with username, email, password
- ✅ **User profile** with:
  - Username
  - Current level
  - Total XP
  - Achievements earned
  - Customizable profile picture
  - Bio
- ✅ **Single "User" role** with full permissions

### 8. Data Seeding
- ✅ **Must seed on application startup**:
  - 20 levels with exponential XP
  - 10 achievements with bonus XP
  - 4 default labels (Work, Personal, Errands, Goals)

---

## ❌ MUST NOT DO - Critical Restrictions

### 1. Leveling System
- ❌ **NEVER use linear level progression**
  - Must be exponential scaling
  - Must use formula like `XP = 100 * (level ^ 1.5)`
- ❌ **NEVER change the fixed XP values**
  - High must always be 100 XP
  - Medium must always be 50 XP
  - Low must always be 25 XP

### 2. Achievements
- ❌ **NEVER hide unearned achievements**
  - All 10 achievements must be visible from the start
  - Show locked/unlocked state, but never hide
- ❌ **NEVER skip achievement bonus XP**
  - Achievements must award bonus XP when unlocked
  - This bonus XP is in addition to task completion XP

### 3. Custom Labels
- ❌ **NEVER limit the number of custom labels**
  - Users must be able to create unlimited labels
  - No arbitrary cap (e.g., no "max 20 labels")

### 4. Progress Bars
- ❌ **NEVER put progress bar in only one location**
  - Must be in header AND profile page
  - Both are required, not optional

### 5. Seeding Data
- ❌ **NEVER skip seeding data**
  - All 20 levels must be seeded
  - All 10 achievements must be seeded
  - All 4 default labels must be seeded
  - Must happen on application startup/initialization

### 6. UI/UX
- ❌ **NEVER skip the tutorial system**
  - First-login tutorial is required
  - Must cover all core features
- ❌ **NEVER skip toast notifications**
  - Toast must appear when achievements are unlocked
  - Visual feedback is critical for gamification

### 7. Features
- ❌ **NEVER implement only dark OR light mode**
  - Both themes are required
  - Users must be able to toggle between them

---

## 🎯 Success Criteria

The project is complete when:

1. ✅ User can register, login, and manage profile
2. ✅ User can create, edit, complete, and delete tasks
3. ✅ User earns correct XP for each priority (100/50/25)
4. ✅ User levels up using exponential formula (20 levels max)
5. ✅ User can unlock all 10 achievements with bonus XP
6. ✅ User sees toast notifications when achievements unlock
7. ✅ User can create unlimited custom labels
8. ✅ User can filter tasks by multiple labels
9. ✅ User sees progress bars in header AND profile
10. ✅ User sees task completion history with all required fields
11. ✅ User sees ALL achievements (locked/unlocked) from start
12. ✅ User completes interactive tutorial on first login
13. ✅ User can toggle between dark and light mode themes
14. ✅ UI has fantasy RPG aesthetic with deep blues/greens and pixel-art icons
15. ✅ Tooltips appear on form fields and achievement descriptions
16. ✅ Dashboard shows prioritized task list
17. ✅ All seed data (levels, achievements, labels) is present

---

## 📝 Quick Reference: The 10 Achievements

For easy copy-paste during database seeding:

1. **Task Creator I** - Create 5 tasks → 50 bonus XP
2. **Task Creator II** - Create 10 tasks → 100 bonus XP
3. **Task Creator III** - Create 20 tasks → 200 bonus XP
4. **High Priority Master** - Complete 1 high priority task → 75 bonus XP
5. **Medium Priority Master** - Complete 1 medium priority task → 50 bonus XP
6. **Low Priority Master** - Complete 1 low priority task → 25 bonus XP
7. **Level 5 Achiever** - Reach level 5 → 150 bonus XP
8. **Level 10 Achiever** - Reach level 10 → 300 bonus XP
9. **Level 15 Achiever** - Reach level 15 → 500 bonus XP
10. **Label Creator I** - Create 3 custom labels → 75 bonus XP

---

## 📝 Quick Reference: Level XP Requirements

Using formula `XP = 100 * (level ^ 1.5)`:

| Level | XP Required |
|-------|-------------|
| 1     | 100         |
| 2     | 283         |
| 3     | 520         |
| 4     | 800         |
| 5     | 1,118       |
| 6     | 1,470       |
| 7     | 1,853       |
| 8     | 2,263       |
| 9     | 2,700       |
| 10    | 3,162       |
| 11    | 3,648       |
| 12    | 4,157       |
| 13    | 4,688       |
| 14    | 5,241       |
| 15    | 5,814       |
| 16    | 6,406       |
| 17    | 7,018       |
| 18    | 7,648       |
| 19    | 8,296       |
| 20    | 8,944       |

---

**Remember: This is what you'll be judged on. Follow these requirements exactly!**

