# Vercel Deployment Guide

## Prerequisites

1. **GitHub Account** - Your code is already pushed ✅
2. **Vercel Account** - Sign up at https://vercel.com (free)
3. **Supabase Project** - Already set up ✅

---

## Step-by-Step Deployment

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2. Import Your Project

1. After signing in, click **"Add New..."** → **"Project"**
2. Find and select your repository: **`apple-rpg`**
3. Click **"Import"**

### 3. Configure Project Settings

Vercel will detect it's a monorepo. Configure:

**Framework Preset**: Vite  
**Root Directory**: `frontend`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** and add these:

#### Frontend Variables
```
VITE_SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTcyMTQsImV4cCI6MjA3NzIzMzIxNH0.S-Zru90PKqJC8fApbZnfptEbHHSN8OzT2QR4PQnTLT4
```

#### Backend Variables
```
SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTcyMTQsImV4cCI6MjA3NzIzMzIxNH0.S-Zru90PKqJC8fApbZnfptEbHHSN8OzT2QR4PQnTLT4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YmVtbWl1d21hZ2Jld3RmZHF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY1NzIxNCwiZXhwIjoyMDc3MjMzMjE0fQ.PhIvokRvtqHY_Ew0VyNWc-byL2bDu-kwRZr0BTxXCDI
NODE_ENV=production
```

**Note**: For all variables, set them for **"Production"** environment.

### 5. Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://apple-rpg-xxx.vercel.app`

### 6. Update Supabase CORS

After deployment, update your Supabase project:

1. Go to Supabase Dashboard → Settings → API
2. Add your Vercel URL to allowed origins
3. Example: `https://apple-rpg-xxx.vercel.app`

### 7. Test Production

1. Visit your Vercel URL
2. Create a test account
3. Create a task
4. Complete a task
5. Upload profile picture
6. Test all features!

---

## Troubleshooting

### Build Fails
- Check that `frontend` is set as root directory
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### API Errors (404)
- Verify backend environment variables are set
- Check that `vercel.json` is in the root directory
- Ensure API routes start with `/api/`

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check that Supabase project is active
- Ensure RLS policies are set up

### CORS Errors
- Add Vercel URL to Supabase allowed origins
- Update `backend/src/server.js` CORS config if needed

---

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps
4. Wait for DNS propagation (~24 hours)

---

## Automatic Deployments

Now every time you push to GitHub:
- `main` branch → Production deployment
- `development` branch → Preview deployment

---

## Performance Tips

1. **Enable Edge Functions** in Vercel settings
2. **Add caching** for static assets
3. **Enable compression** in Vercel settings
4. **Monitor** with Vercel Analytics

---

## Success!

Your app is now live at: `https://your-app.vercel.app`

Share it with friends, test it out, and enjoy your fully deployed RPG Todo app! 🎉

---

## Next Steps After Deployment

1. **Test thoroughly** in production
2. **Monitor errors** in Vercel dashboard
3. **Gather user feedback**
4. **Iterate and improve**
5. **Add custom domain** (optional)

---

*Your RPG Todo app is now live on the internet!* 🚀

