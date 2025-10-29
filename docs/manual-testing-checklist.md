# RPG Todo - Manual Testing Checklist

**Version**: Phase 4 Complete  
**Date**: 28 October 2025

---

## Pre-Test Setup

- [ ] Both frontend and backend servers are running
- [ ] Supabase database is accessible
- [ ] Browser is open to `http://localhost:5173`
- [ ] Console is open (F12) to check for errors

---

## 1. Authentication Tests

### Registration
- [ ] Can register a new account with email and password
- [ ] Email verification is required (check email)
- [ ] Cannot register with existing email
- [ ] Cannot register with weak password

### Login
- [ ] Can log in with correct credentials
- [ ] Cannot log in with incorrect password
- [ ] Cannot log in with non-existent email
- [ ] Session persists after page reload

### Logout
- [ ] Can log out successfully
- [ ] Redirected to login page after logout
- [ ] Cannot access protected routes when logged out

---

## 2. Task Management Tests

### Create Tasks
- [ ] Can create a high priority task
- [ ] Can create a medium priority task
- [ ] Can create a low priority task
- [ ] Can create task with description
- [ ] Can create task with due date
- [ ] Can create task with labels
- [ ] Cannot create task without title
- [ ] Task appears in task list immediately

### Complete Tasks
- [ ] Can mark task as complete (checkmark button)
- [ ] Completed task shows dimmed/strikethrough
- [ ] XP is awarded (check header progress bar)
- [ ] Achievement toast appears for first high priority completion
- [ ] Achievement toast appears for first medium priority completion
- [ ] Achievement toast appears for first low priority completion
- [ ] Profile XP updates correctly

### Delete Tasks
- [ ] Can delete a task
- [ ] Confirmation dialog appears
- [ ] Task removed from list after confirmation
- [ ] Can cancel deletion

### Task Display
- [ ] Tasks sorted by priority (High → Medium → Low)
- [ ] Completed tasks shown at bottom
- [ ] Task labels displayed correctly
- [ ] Due dates displayed in correct format
- [ ] Priority badges show correct colours

---

## 3. Label Management Tests

### Create Labels
- [ ] Can open label manager section
- [ ] Can create a new custom label
- [ ] Label appears in list immediately
- [ ] Achievement toast for 3 labels (Label Creator I)
- [ ] Default labels (Work, Personal, Errands, Goals) shown separately

### Edit Labels
- [ ] Can click edit icon on custom label
- [ ] Can change label name
- [ ] Cannot edit default labels
- [ ] Changes saved correctly

### Delete Labels
- [ ] Can delete custom labels
- [ ] Confirmation dialog appears
- [ ] Cannot delete default labels
- [ ] Label removed from tasks after deletion

### Label Filtering
- [ ] Can filter tasks by single label
- [ ] Can filter tasks by multiple labels
- [ ] "Clear filters" button appears when filtering
- [ ] Task count updates correctly with filters
- [ ] Empty state shows when no tasks match filter

---

## 4. XP & Levelling System Tests

### XP Awards
- [ ] High priority task: +100 XP
- [ ] Medium priority task: +50 XP
- [ ] Low priority task: +25 XP
- [ ] Achievement bonus XP adds to total
- [ ] Progress bar in header updates in real-time
- [ ] Lifetime XP displayed correctly

### Levelling
- [ ] Level increases when XP threshold reached
- [ ] Level displayed in header
- [ ] Level displayed on Profile page
- [ ] Progress bar shows correct percentage
- [ ] XP progress resets after level up (0/X towards next level)
- [ ] Max level is 20

### Level Requirements (Sample)
- [ ] Level 1: 0 XP
- [ ] Level 2: 183 XP
- [ ] Level 3: 282 XP
- [ ] Level 4: 400 XP
- [ ] Level 5: 547 XP

---

## 5. Achievement System Tests

### Task Creator Achievements
- [ ] Task Creator I: 5 tasks created (+50 XP bonus)
- [ ] Task Creator II: 10 tasks created (+100 XP bonus)
- [ ] Task Creator III: 20 tasks created (+200 XP bonus)

### Priority Completion Achievements
- [ ] High Priority Master: 1 high task completed (+75 XP bonus)
- [ ] Medium Priority Master: 1 medium task completed (+50 XP bonus)
- [ ] Low Priority Master: 1 low task completed (+25 XP bonus)

### Level Achievements
- [ ] Level 5 Achiever: Reach level 5 (+150 XP bonus)
- [ ] Level 10 Achiever: Reach level 10 (+300 XP bonus)
- [ ] Level 15 Achiever: Reach level 15 (+500 XP bonus)

### Label Achievement
- [ ] Label Creator I: 3 custom labels created (+75 XP bonus)

### Achievement Display
- [ ] Locked achievements show lock icon
- [ ] Unlocked achievements show checkmark icon
- [ ] Progress percentage shown correctly
- [ ] Achievement descriptions visible
- [ ] Earned date shown for unlocked achievements
- [ ] Completion message when all achievements unlocked

---

## 6. History Page Tests

### Display
- [ ] Shows all completed tasks
- [ ] Tasks grouped by completion date
- [ ] Timeline format with date headers
- [ ] Stats dashboard shows: tasks completed, XP earned, days active

### Task Details
- [ ] Task title displayed
- [ ] Task description shown (if present)
- [ ] Priority badge displayed
- [ ] Labels shown
- [ ] Completion timestamp shown
- [ ] XP earned displayed

### Empty State
- [ ] Empty state shown when no completed tasks
- [ ] Appropriate message displayed

---

## 7. Profile Page Tests

### Display
- [ ] Username shown
- [ ] Current level shown
- [ ] Total XP displayed
- [ ] Progress bar to next level
- [ ] Progress percentage shown
- [ ] XP needed for next level shown
- [ ] Achievement count shown

### Max Level
- [ ] At level 20, shows "Max Level" indicator
- [ ] Progress bar shows 100%

---

## 8. Dark Mode Tests

### Toggle
- [ ] Can click sun/moon icon in header
- [ ] Theme switches immediately
- [ ] All pages respect dark mode
- [ ] All components styled correctly in dark mode

### Persistence
- [ ] Theme preference saved to localStorage
- [ ] Theme persists after page reload
- [ ] Theme persists after logout/login

### Colours
- [ ] Light mode: white backgrounds, dark text
- [ ] Dark mode: dark backgrounds, light text
- [ ] Green accent colour consistent
- [ ] Good contrast in both modes

---

## 9. Toast Notification Tests

### Achievement Toasts
- [ ] Golden gradient background
- [ ] Trophy icon displayed
- [ ] Achievement name shown
- [ ] Bonus XP amount shown
- [ ] Slides in from right
- [ ] Auto-dismisses after 6 seconds
- [ ] Can manually dismiss with X button
- [ ] Multiple toasts stack correctly

---

## 10. UI/UX Tests

### Navigation
- [ ] All navigation links work
- [ ] Active page highlighted in nav
- [ ] Logo links to dashboard
- [ ] Header sticky at top of page

### Responsive Design
- [ ] Desktop layout works (1920x1080)
- [ ] Tablet layout works (768px)
- [ ] Mobile layout adapts (375px)
- [ ] No horizontal scrolling

### Forms
- [ ] All form fields work
- [ ] Validation messages shown
- [ ] Submit buttons disabled when invalid
- [ ] Loading states shown during submission

### Tooltips
- [ ] Hover over (?) icons shows tooltips
- [ ] Tooltips positioned correctly
- [ ] Tooltips dismissable

### Animations
- [ ] Smooth transitions between pages
- [ ] Toast slide-in animation smooth
- [ ] Button hover effects work
- [ ] Progress bar fills smoothly

---

## 11. Error Handling Tests

### Network Errors
- [ ] Graceful handling when backend is down
- [ ] Error messages shown to user
- [ ] Can retry failed operations

### Validation Errors
- [ ] Cannot submit empty forms
- [ ] Clear error messages
- [ ] Field-level validation

### Edge Cases
- [ ] Can handle long task titles
- [ ] Can handle long descriptions
- [ ] Can handle many labels
- [ ] Can handle many tasks

---

## 12. Performance Tests

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Task list renders instantly
- [ ] No lag when creating tasks
- [ ] No lag when completing tasks

### Data Fetching
- [ ] No unnecessary refetches
- [ ] Optimistic UI updates
- [ ] Background refetches work

---

## 13. Security Tests

### Authentication
- [ ] Cannot access dashboard when logged out
- [ ] Cannot access other users' data
- [ ] JWT tokens handled securely
- [ ] No sensitive data in console logs

### Row Level Security
- [ ] Can only see own tasks
- [ ] Can only modify own tasks
- [ ] Can only see own labels
- [ ] Can only see own achievements

---

## Known Issues / Won't Fix

- [ ] Tutorial system not implemented (cancelled)
- [ ] Pixel art icons not implemented (using Lucide icons)
- [ ] Email verification flow (Supabase default behaviour)

---

## Critical Path (Minimum Viable Test)

If time is limited, test these critical paths:

1. **Register/Login** → Can access app
2. **Create Task** → Task appears
3. **Complete Task** → XP awarded, achievement unlocked
4. **Create Labels** → Labels work, achievement unlocked
5. **Dark Mode** → Toggle works
6. **History** → Shows completed tasks

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Pass/Fail Criteria

**Pass**: All critical path tests pass, no blocking bugs  
**Fail**: Any critical feature broken or data loss possible

---

**Testing completed by**: _________________  
**Date**: _________________  
**Result**: Pass ☐ / Fail ☐  
**Notes**:

