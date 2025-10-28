# Quick Fixes Applied

## Issue 1: RLS Policy Error - Tasks Not Creating

**Problem**: `new row violates row-level security policy for table "tasks"`

**Root Cause**: The frontend wasn't explicitly setting the `user_id` field when creating tasks. The RLS policy requires `user_id` to match `auth.uid()`.

**Fix Applied**:
- Updated `useTasks.js` to fetch current user and explicitly set `user_id` when creating tasks
- Updated task fetching to filter by `user_id`

**Files Changed**:
- `/frontend/src/hooks/useTasks.js`

**Status**: ✅ Fixed

---

## Issue 2: Timestamp Input Error

**Problem**: `invalid input syntax for type timestamp with time zone: ""`

**Root Cause**: When `due_date` field is empty, we were sending an empty string `""` instead of `null` to the database.

**Fix Applied**:
- Updated `Dashboard.jsx` to convert empty strings to `null` for optional fields (`description` and `due_date`)

**Files Changed**:
- `/frontend/src/pages/Dashboard.jsx`

**Status**: ✅ Fixed - Vite should auto-reload

---

## Issue 3: Email Verification Required

**Problem**: Supabase requires email verification by default before users can log in.

**Solution**: Check your email inbox for verification email from Supabase and click the verification link.

**For Future Users**: 
To disable email verification (development only):
1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Email" provider
3. Toggle "Confirm email" to OFF

**Status**: ✅ User verified email

---

## What to Do Now

1. **Refresh your browser** (the fix should auto-reload)
2. **Try creating a task again** - leave the due date empty or fill it in
3. Both should work now!

---

**Testing Checklist**:
- [ ] Create a HIGH priority task (no due date)
- [ ] Create a task WITH a due date
- [ ] Complete tasks
- [ ] Verify XP awards correctly
- [ ] Check progress bar updates



