# Dr. Spill - Vanilla HTML/CSS/JS Setup

This project has been converted to vanilla HTML, CSS, and JavaScript for easy deployment anywhere, including GitHub Pages.

## Files Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # All JavaScript functionality
├── logo.png            # Dr. Spill logo (add your logo here)
└── README.md           # This file
```

## Setup Instructions

### 1. Add Your Logo

Place your Dr. Spill logo image as `logo.png` in the root directory. If the logo is not found, a placeholder will be shown automatically.

### 2. Configure Supabase (Optional)

If you want to use Supabase for storing signups:

1. Open `script.js`
2. Replace the placeholder values at the top of the file:

```javascript
const SUPABASE_PROJECT_ID = 'your-project-id';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

**Without Supabase:** The site will work in demo mode using `localStorage` to store signups locally in the browser.

### 3. Deploy to GitHub Pages

#### Method 1: Direct Upload

1. Create a new GitHub repository
2. Upload these files to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `logo.png`
3. Go to repository Settings → Pages
4. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: Select `main` (or `master`) and `/ (root)`
   - Click Save
5. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

#### Method 2: Using Git

```bash
# Initialize git repository
git init

# Add files
git add index.html styles.css script.js logo.png

# Commit
git commit -m "Initial commit"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in Settings → Pages as described above.

## Features

### Main Page
- Animated heart monitor ECG background
- Horizontally rotating logo
- Prescription-style signup form
- Smooth CSS animations throughout
- Fully responsive design

### Admin Panel
- Access by adding `?admin=true` to the URL
- Password: `Favored247` (change in `script.js` if needed)
- View all signups
- Export signups to CSV
- Real-time dashboard with stats

### How to Change Admin Password

Edit `script.js` and change this line:

```javascript
const ADMIN_PASSWORD = 'Favored247';  // Change this to your password
```

## Demo Mode (localStorage)

If Supabase is not configured, the site will automatically use `localStorage`:
- Signups are saved in the browser's local storage
- Data persists across page refreshes
- Each browser has its own separate data
- Great for testing and demonstrations

## Browser Compatibility

- Chrome/Edge: ✓
- Firefox: ✓
- Safari: ✓
- Mobile browsers: ✓

## Customization

### Colors

All colors are defined in `styles.css`. The main theme colors are:
- Teal/Cyan: `#14b8a6`, `#06b6d4`, `#5eead4`
- Red: `#ef4444`
- Dark backgrounds: `#000`, `#18181b`, `#27272a`

### Animations

Modify animation speeds in `styles.css`:
- Logo rotation: Find `@keyframes rotate-logo` (currently 20s)
- Background blobs: Find `.blob-teal` and `.blob-red` animations
- ECG scroll: Find `.ecg-line` animation in `styles.css`

## Troubleshooting

**Logo not showing:**
- Make sure `logo.png` exists in the root directory
- Check browser console for errors
- A placeholder will automatically appear if logo is missing

**Signups not saving:**
- Check browser console for errors
- If using Supabase, verify your credentials in `script.js`
- In demo mode, data is saved in localStorage (won't sync across devices)

**Admin panel not accessible:**
- Add `?admin=true` to your URL
- Default password is `Favored247`
- Check browser console for errors

**Styles not loading:**
- Ensure `styles.css` is in the same directory as `index.html`
- Check for any typos in the file path
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## File Size

- index.html: ~11 KB
- styles.css: ~11 KB
- script.js: ~9 KB
- **Total**: ~31 KB (extremely lightweight!)

## No Build Process Required

Unlike the React version, these files work directly in any browser without:
- No npm install
- No build step
- No bundlers
- No dependencies

Simply open `index.html` in a browser or upload to any web host!

## License

© 2026 Dr. Spill. All rights reserved.
