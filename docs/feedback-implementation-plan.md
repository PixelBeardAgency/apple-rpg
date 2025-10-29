# Manual Testing Feedback - Implementation Plan

**Date**: 28 October 2025  
**Tester Feedback Received**: 14 items  
**Status**: In Progress

---

## Feedback Items & Status

### ✅ COMPLETED

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 6 | Smart task sorting (today first, then no-date, then future) | ✅ Done | Sorts within priority groups |

### 🔨 IN PROGRESS

| # | Issue | Status | Complexity | ETA |
|---|-------|--------|------------|-----|
| 2 | Password requirements message | Easy | 5 min |
| 3 | "Email already exists" error | Easy | 10 min |
| 7 | Allow deleting default labels | Easy | 10 min |
| 8 | Start at Level 0 instead of Level 1 | Medium | 20 min |
| 13 | Show time only in history (not full date) | Easy | 5 min |

### 📋 PENDING (High Priority)

| # | Issue | Complexity | ETA |
|---|-------|------------|-----|
| 1 | Fix duplicate registration bug | Medium | 15 min |
| 9 | Custom delete confirmation modal | Medium | 30 min |
| 10 | **Task editing functionality** | **High** | **60 min** |
| 12 | Achievement progress indicators | Medium | 30 min |

### 📋 PENDING (Lower Priority)

| # | Issue | Complexity | ETA |
|---|-------|------------|-----|
| 4 | Show email in users table (Supabase config) | Easy | 5 min |
| 5 | SQL injection tests | Medium | 30 min |
| 11 | XP/Level helper modal | Medium | 30 min |
| 14 | Interactive tutorial | High | 90 min |

---

## Implementation Order (Recommended)

### Batch 1: Quick Wins (30 min total)
1. ✅ Task sorting - **DONE**
2. Password requirements message
3. "Email exists" error
4. Show time only in history
5. Allow deleting default labels

### Batch 2: Important UX (90 min total)
6. Start at Level 0
7. Fix duplicate registration
8. Custom delete modal
9. Achievement progress indicators

### Batch 3: Major Features (150 min total)
10. **Task editing** (most requested)
11. XP/Level helper modal
12. SQL injection protection

### Batch 4: Nice-to-Have (90 min total)
13. Interactive tutorial
14. Email in users table

---

## Detailed Implementation Notes

### #1 - Duplicate Registration Bug
**Problem**: Second registration attempt with same email shows no error  
**Solution**: Add proper error handling in Register.jsx to catch Supabase errors  
**Files**: `frontend/src/pages/Register.jsx`

### #2 - Password Requirements
**Problem**: No indication of password requirements  
**Solution**: Add helper text under password field  
**Requirements**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number  
**Files**: `frontend/src/pages/Register.jsx`

### #3 - Email Already Exists Message
**Problem**: Generic error, not specific  
**Solution**: Parse Supabase error and show friendly message  
**Security**: Safe to show - Supabase already returns this info  
**Files**: `frontend/src/pages/Register.jsx`

### #4 - Email in Users Table
**Problem**: Can't see email in Supabase dashboard  
**Solution**: This is a Supabase dashboard config, not code change  
**Action**: User needs to configure column visibility in Supabase UI

### #5 - SQL Injection Protection
**Current**: Supabase has built-in protection (parameterized queries)  
**Action**: Add automated tests to verify  
**Tests**: Test special chars in task titles, descriptions, labels  
**Files**: Create `backend/src/tests/security.test.js`

### #6 - Task Sorting ✅
**Implemented**: Smart sorting logic  
**Logic**:  
  1. Completed tasks at bottom  
  2. Within priority: Today's tasks first  
  3. Then no-date tasks  
  4. Then future-dated tasks (chronological)

### #7 - Delete Default Labels
**Problem**: Users can't remove default labels they don't need  
**Solution**: Add delete button for default labels in LabelManager  
**Note**: Only hide delete for system-critical labels (if any)  
**Files**: `frontend/src/components/labels/LabelManager.jsx`

### #8 - Start at Level 0
**Problem**: New users see full Level 1 bar with confusing "-100/182 XP"  
**Solution**: Change initial level to 0, adjust XP formula  
**Impact**: Database schema, seed data, all XP calculations  
**Files**:  
  - `backend/src/db/schema.sql` - default level  
  - `backend/src/db/seed.js` - level 0 entry  
  - `backend/src/services/xpService.js` - calculations  
  - `frontend/src/hooks/useProfile.js` - display logic

### #9 - Custom Delete Modal
**Problem**: System confirm() is ugly and not branded  
**Solution**: Create custom Modal component with brand styling  
**Files**:  
  - Create `frontend/src/components/ui/Modal.jsx`  
  - Update `frontend/src/pages/Dashboard.jsx`

### #10 - Task Editing ⭐ MOST REQUESTED
**Features Needed**:  
  - Edit title  
  - Edit description  
  - Change priority  
  - Update due date  
  - Add/remove labels  
**UI**: Edit icon button on each task  
**Implementation**:  
  - Add `useUpdateTask` hook (already exists!)  
  - Create edit form modal/inline  
  - Wire up to backend API  
**Files**:  
  - `frontend/src/pages/Dashboard.jsx`  
  - `frontend/src/hooks/useTasks.js` (already has update function)

### #11 - XP/Level Helper Modal
**Content**: Table showing all 20 levels with XP requirements  
**Highlight**: User's current level  
**Trigger**: ? button next to "Current Level" on dashboard  
**Files**:  
  - Create `frontend/src/components/modals/XPGuideModal.jsx`  
  - Update `frontend/src/pages/Dashboard.jsx`

### #12 - Achievement Progress Indicators
**Add**: "X/Y complete" text or progress bar on achievement tiles  
**Logic**: Backend needs to return current progress, not just earned status  
**Files**:  
  - `backend/src/services/achievementService.js` - add progress calc  
  - `backend/src/routes/achievements.js` - return progress  
  - `frontend/src/pages/Achievements.jsx` - display progress

### #13 - History Time Format
**Current**: "Completed 28 Oct 2025, 09:42"  
**Requested**: "Completed at 09:42" (since already grouped by date)  
**Files**: `frontend/src/pages/History.jsx`

### #14 - Interactive Tutorial
**Reason Cancelled**: Assumed app was intuitive enough  
**User Feedback**: Still in PRD, should implement  
**Solution**: Create step-by-step onboarding flow  
**Trigger**: First login (check localStorage flag)  
**Steps**:  
  1. Welcome message  
  2. Create your first task  
  3. Complete a task to earn XP  
  4. Create a custom label  
  5. Filter by label  
**Files**:  
  - Create `frontend/src/components/tutorial/TutorialModal.jsx`  
  - Add tutorial state management

---

## Next Steps

**Recommendation**: Implement in batches to allow testing between each batch.

**Start with Batch 1** (Quick wins - 30 min):
- These are easy and high-impact
- Get immediate user satisfaction
- Can be committed together

**Then Batch 2** (Important UX - 90 min):
- Fixes frustrating bugs
- Improves core experience
- User will notice these most

**Save Batch 3 & 4** for later:
- Task editing is most complex
- Tutorial needs careful UX design
- Can be separate feature releases

---

**Would you like me to proceed with Batch 1 implementations?**

