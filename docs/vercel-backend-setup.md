# Vercel Backend Setup - CRITICAL INFO

## ⚠️ IMPORTANT: Backend is Serverless on Vercel

Your backend runs as **Vercel Serverless Functions** on the same domain as the frontend!

## How It Works

### Local Development:
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
```

### Production (Vercel):
```
Frontend: https://apple-rpg.vercel.app
Backend API: https://apple-rpg.vercel.app/api/*
```

**SAME DOMAIN!** The backend routes through Vercel's routing (see `vercel.json`)

## Environment Variables

### Local (.env files)
```bash
# frontend/.env
VITE_API_URL=http://localhost:3000   # Points to local backend

# backend/.env  
SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Vercel Dashboard
**YOU MUST ADD THESE IN VERCEL:**

#### Frontend Variables (VITE_*)
```
VITE_SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**DO NOT SET** `VITE_API_URL` in Vercel - it uses relative URLs automatically!

#### Backend Variables
```
SUPABASE_URL=https://jybemmiuwmagbewtfdqu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

## Code Configuration

### API URL Logic (Updated!)
```javascript
// Uses relative URLs on Vercel, localhost for local dev
const API_URL = import.meta.env.VITE_API_URL || '';

// Local dev: http://localhost:3000/api/tasks
// Production: /api/tasks (same domain, Vercel routes to backend)
```

### Files Updated:
- ✅ `frontend/src/pages/Register.jsx`
- ✅ `frontend/src/hooks/useTasks.js`
- ✅ `frontend/src/hooks/useLabels.js`

## Vercel Routing (vercel.json)

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/server.js"  // Backend serverless function
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"  // Frontend static files
    }
  ]
}
```

This means:
- `/api/tasks` → backend/src/server.js
- `/api/auth` → backend/src/server.js
- `/` → frontend (React app)
- `/dashboard` → frontend (React Router)

## Steps to Deploy

### 1. Commit & Push Changes
```bash
git add -A
git commit -m "Fix API URLs for Vercel serverless backend"
git push origin main
```

### 2. Add Environment Variables in Vercel
1. Go to https://vercel.com/your-project
2. Click Settings → Environment Variables
3. Add **ALL** the variables listed above
4. Make sure to select "Production" environment

### 3. Redeploy
- Vercel will automatically redeploy when you push
- OR manually trigger: Deployments → Latest → Redeploy

### 4. Test
1. Visit https://apple-rpg.vercel.app/register
2. Try creating an account
3. Username validation should work (API call to /api/auth/check-username)
4. Registration should work (API call to /api/auth/register)

## Troubleshooting

### "Failed to fetch" errors
- Check that backend env vars are set in Vercel
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check Vercel deployment logs

### Username validation not working
- API calls to `/api/auth/check-username` should return 200
- Check Network tab in browser DevTools
- Look for CORS errors (update backend CORS config if needed)

### Backend not running
- Vercel serverless functions are COLD START
- First request may be slow (2-3 seconds)
- Subsequent requests are fast (<100ms)

## CORS Configuration

Your backend CORS is currently set to localhost only. Update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://apple-rpg.vercel.app',  // ADD THIS!
    'https://apple-rpg-*.vercel.app'  // Preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Summary

✅ Backend runs as serverless functions on Vercel  
✅ Frontend and backend on SAME DOMAIN  
✅ Code updated to use relative URLs on Vercel  
✅ Environment variables control local vs production  
✅ vercel.json routes /api/* to backend  

**Next Step**: Commit changes, push to GitHub, Vercel auto-deploys!

