# GitHub Pages Deployment Guide

This project is configured to be deployed to GitHub Pages. Follow these steps to deploy your site.

## Prerequisites

1. A GitHub account
2. A GitHub repository for this project
3. Node.js and npm installed locally (for manual deployment)

## Automatic Deployment with GitHub Actions (Recommended)

The site will automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Setup Steps:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings**
   - Scroll down to **Pages** in the left sidebar
   - Under **Build and deployment**:
     - Source: Select **GitHub Actions**
   
3. **Wait for deployment:**
   - The GitHub Actions workflow will automatically run
   - Check the **Actions** tab to see the deployment progress
   - Once complete, your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Manual Deployment (Alternative)

If you prefer to deploy manually using the gh-pages branch:

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.ts:**
   Change the `base` setting to match your repository name:
   ```typescript
   base: '/YOUR_REPO/',  // Replace YOUR_REPO with your actual repo name
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: Select `gh-pages` and `/ (root)`
   - Save

## Important Notes

### Custom Domain
If you want to use a custom domain:
1. Add a file named `CNAME` in the `/public` folder with your domain name
2. Configure your DNS settings to point to GitHub Pages
3. Enable custom domain in repository Settings → Pages

### Base Path Configuration
The current configuration uses `base: './'` which works for both:
- User/Organization pages: `https://USERNAME.github.io/`
- Project pages: `https://USERNAME.github.io/REPO/`

If you need to deploy to a specific path, update the `base` in `vite.config.ts`:
```typescript
base: '/YOUR_REPO/',  // For project pages
// or
base: '/',  // For user/org pages
```

### Backend Integration
Your Supabase backend will continue to work on GitHub Pages since it's hosted separately. Make sure your Supabase environment variables are properly configured in the Supabase dashboard.

## Troubleshooting

**Site not loading correctly:**
- Check the `base` path in `vite.config.ts` matches your deployment URL
- Verify GitHub Pages is enabled in repository settings
- Check the Actions tab for any build errors

**404 errors:**
- Single-page applications need a 404.html that redirects to index.html
- This is handled automatically by the build process

**Assets not loading:**
- Ensure `base` path is correctly set
- Check browser console for CORS or path errors

## Your Site

After deployment, your site will be available at:
- **User/Org Site:** `https://YOUR_USERNAME.github.io/`
- **Project Site:** `https://YOUR_USERNAME.github.io/YOUR_REPO/`

Access the admin dashboard by adding `?admin=true` to the URL.
