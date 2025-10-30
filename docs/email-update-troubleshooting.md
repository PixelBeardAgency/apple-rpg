# Email Update Issue - Troubleshooting Guide

## ⚠️ IMPORTANT: Current Behavior

**You must click the confirmation link in BOTH emails (old and new) for the email change to take effect.**

This is unusual Supabase behavior (normally only the new email link is required), but it's been confirmed through testing. The exact cause is unknown but may be related to project settings or Supabase version.

**Steps to change email:**
1. Go to Profile → Change Email
2. Enter new email + password
3. Check your OLD email inbox → Click the confirmation link
4. Check your NEW email inbox → Click the confirmation link
5. Log out and log back in with your NEW email address

---

## The Problem
Email update shows success but:
- No confirmation email is sent
- Login still works with old email only
- New email doesn't work for login

## Root Cause
This is likely a **Supabase configuration issue**, not a code issue. Supabase needs to be configured to send confirmation emails.

## How Email Updates SHOULD Work

When you call `supabase.auth.updateUser({ email: newEmail })`:

1. Supabase sends a **confirmation email to the NEW email address**
2. User clicks the confirmation link in that email
3. Email is changed to the new address
4. Old email no longer works for login

**Important:** The email does NOT change until the user clicks the confirmation link!

## Supabase Configuration Checklist

### 1. Check Email Confirmation Settings

Go to your Supabase Dashboard:
1. Open your project
2. Go to **Authentication** → **Settings** → **Auth Settings**
3. Find **"Enable email confirmations"**
4. Make sure it's **ENABLED** ✅

### 2. Check SMTP/Email Provider

Go to **Authentication** → **Settings** → **SMTP Settings**

**Option A: Use Supabase's Built-in Email (Development)**
- This should work for testing
- Limited to 3-4 emails per hour

**Option B: Configure Custom SMTP (Production)**
- Recommended for production
- Use SendGrid, Mailgun, AWS SES, etc.
- Configure SMTP host, port, username, password

### 3. Check Email Templates

Go to **Authentication** → **Email Templates**

Find the **"Change Email Address"** template and ensure:
- It's enabled
- The template looks correct
- The confirmation link is present: `{{ .ConfirmationURL }}`

### 4. Check Email Rate Limits

If using Supabase's built-in email:
- Limited to 3-4 emails per hour
- If you've been testing, you might have hit the limit
- Wait an hour or configure custom SMTP

## Testing Steps

Once Vercel deploys the new code (~1-2 minutes):

1. Try changing your email again
2. Open the browser console (F12)
3. Look for the log message: `Email update response: ...`
4. Check what data is returned
5. Check BOTH your old email AND new email inboxes
6. Check spam folders!

## Expected Console Output

You should see something like:
```javascript
Email update response: {
  user: {
    id: "...",
    email: "old@email.com", // Still the old email until confirmed!
    new_email: "new@email.com", // The pending new email
    email_change_sent_at: "2025-10-29T..."
  }
}
```

If `new_email` is present in the response, the email change was initiated successfully.

## Alternative: Manual Email Update

If email confirmation is problematic, you can manually update the email in Supabase:

1. Go to Supabase Dashboard
2. **Authentication** → **Users**
3. Find your user
4. Click the user
5. Manually change the email field
6. Click "Update User"

This bypasses the confirmation process.

## Recommended Fix for Your Project

**Short-term (Testing):**
- Use manual email updates in Supabase Dashboard
- Or wait for confirmation emails (check spam!)

**Long-term (Production):**
1. Configure a proper SMTP provider (SendGrid/Mailgun)
2. Set up custom email templates
3. Test the flow thoroughly

## Code Changes Made

I've updated the code to:
- ✅ Add `emailRedirectTo` option (redirects to profile after confirmation)
- ✅ Log the response to console for debugging
- ✅ Clarify success message about checking BOTH email addresses
- ✅ Extend timeout to 8 seconds for longer message

---

**Next Steps:**
1. Check your Supabase email settings (see checklist above)
2. Try the email update again after Vercel deploys
3. Check browser console for the response log
4. Check both email inboxes (old and new) + spam folders

