# Deployment Guide

This guide will help you deploy the Super Offer application to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (or any MongoDB hosting)
- Google Maps API key
- Vercel account (frontend)
- Render account (backend)

---

## Backend Deployment (Render)

### Step 1: Prepare Your Code

1. Make sure your `package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "node server.js"
   }
   ```

2. Ensure your `server.js` handles the production port:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/super-offer.git
   git push -u origin main
   ```

### Step 3: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: super-offer-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_REFRESH_SECRET=your_secure_refresh_secret
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   COOKIE_SECRET=your_cookie_secret
   ```
6. Click "Create Web Service"

### Step 4: Verify Backend

Your backend will be available at: `https://super-offer-backend.onrender.com`

Test it:
```bash
curl https://your-backend.onrender.com/api/health
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Code

1. Make sure your `vite.config.js` has proper configuration:
   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: 'https://your-backend.onrender.com',
           changeOrigin: true
         }
       }
     }
   });
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Click "Deploy"

### Step 3: Configure API Proxy (Optional)

For production, update your API calls to use the full backend URL:

1. In `frontend/src/services/api.js`:
   ```javascript
   import axios from 'axios';

   const API_URL = process.env.VITE_API_URL || '/api';

   const api = axios.create({
     baseURL: API_URL,
     // ... rest of config
   });
   ```

2. In `vite.config.js`, remove the proxy configuration for production or update it:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: process.env.NODE_ENV === 'production' ? undefined : {
         '/api': {
           target: 'http://localhost:5000',
           changeOrigin: true
         }
       }
     }
   });
   ```

---

## MongoDB Atlas Setup

### Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account

### Step 2: Create Cluster

1. Click "Create a Cluster"
2. Select "Free Tier" (M0)
3. Choose your preferred region
4. Click "Create Cluster"

### Step 3: Configure Database

1. Click "Database" → "Browse Collections"
2. Click "Create Database"
3. Add database name: `super_offer`

### Step 4: Create User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Grant "Read and Write to any database"

### Step 5: Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development

### Step 6: Get Connection String

1. Click "Database" → "Connect"
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

---

## Google Maps API Setup

### Step 1: Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "API Key"

### Step 2: Enable APIs

Enable the following APIs:
- Maps JavaScript API
- Geocoding API
- Places API

### Step 3: Restrict API Key (Recommended)

1. Go to your API key settings
2. Set HTTP referrer restrictions for your domain
3. Enable only required APIs

---

## Production Checklist

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Use secure JWT secrets (32+ characters)
- [ ] Configure proper CORS
- [ ] Enable rate limiting
- [ ] Use HTTPS

### Frontend
- [ ] Build for production: `npm run build`
- [ ] Set correct API URL
- [ ] Configure Google Maps API key
- [ ] Test on mobile devices

### Database
- [ ] Create production database
- [ ] Configure proper users and roles
- [ ] Set up backups (optional)

---

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL
- Check that credentials are enabled

### Authentication Issues
- Verify JWT secrets match
- Check token expiration settings
- Ensure cookies are configured correctly

### Map Not Loading
- Verify Google Maps API key is correct
- Check API is enabled in Google Cloud Console
- Verify billing is enabled (required for Maps API)

### Database Connection
- Verify MongoDB URI is correct
- Check network access settings
- Ensure database user has correct permissions

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| MONGODB_URI | Database connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | random32charstring |
| JWT_REFRESH_SECRET | Refresh token secret | random32charstring |
| JWT_EXPIRE | Access token expiry | 7d |
| JWT_REFRESH_EXPIRE | Refresh token expiry | 30d |
| FRONTEND_URL | Frontend URL | https://...vercel.app |
| GOOGLE_MAPS_API_KEY | Google Maps API key | AIza... |
| COOKIE_SECRET | Cookie signing secret | random32charstring |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_GOOGLE_MAPS_API_KEY | Google Maps API key | AIza... |
| VITE_API_URL | Backend API URL | https://...onrender.com/api |

---

## Support

If you encounter any issues, please check:
1. Console logs in browser
2. Network tab for API calls
3. Backend logs in Render dashboard
4. MongoDB Atlas logs

---

## Next Steps

- Set up custom domain (optional)
- Enable SSL/HTTPS
- Configure monitoring
- Set up CI/CD pipeline
- Add more features!

