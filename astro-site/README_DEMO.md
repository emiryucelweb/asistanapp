# Demo Site Integration

## Overview

The `/demo` route serves the **real AsistanApp Panel UI** - a fully functional customer management dashboard. This is a 100% static deployment with **NO backend API calls** (read-only mode).

**Location:** `/public/demo/` (statically served by Astro)

**Public URL:** `https://asistanapp.com.tr/demo`

**Source:** Built from `/home/emir/Desktop/asistanapp/apps/panel/dist/`

---

## What is the Demo?

The demo site is the **actual AsistanApp panel application** that demonstrates:
- **3-Panel Interface:** User can select between different panel types (Admin, Agent, Super Admin)
- **Complete Dashboard:** Full UI of customer panel with all screens
- **Localization:** Turkish (TR) and English (EN) language support
- **Chat Management:** Conversation interfaces and chat screens
- **Reports & Analytics:** Report generation and data visualization pages
- **Settings & Configuration:** Panel settings screens
- **Read-Only Mode:** Static deployment - no actual data mutations

**Important:** The demo:
- ✅ Does NOT call real backend APIs
- ✅ Does NOT access sensitive data
- ✅ Does NOT require authentication
- ✅ Works 100% in the browser
- ✅ Is fully static and cacheable

---

## File Structure

```
astro-site/
├── src/
│   └── components/
│       └── Header.astro          # <-- "Demo" button added here
├── public/
│   └── demo/                      # <-- Real panel build output
│       ├── index.html
│       ├── assets/                # JS/CSS bundles (fix asset paths here!)
│       ├── locales/               # i18n JSON files (TR/EN)
│       ├── favicon.svg
│       └── sw.js                  # Service worker
└── README_DEMO.md                 # <-- This file
```

---

## How to Update the Demo

### Source Locations

**Panel Application Source:**
```
~/Desktop/asistanapp/apps/panel/
```
This is the **real AsistanApp panel** - a Vite/React project with:
- Full UI components for 3-panel selection
- Dashboard pages for Admin/Agent/Super Admin roles
- Chat management interfaces
- Reports and analytics screens
- Localization (TR/EN) support

**Legacy Demo Site Source:**
```
~/Desktop/asistanapp-site-new/
```
(Not used for current `/demo` route)

### Update Workflow

**If you need to rebuild the panel for `/demo`:**

1. **Navigate to the panel source:**
   ```bash
   cd ~/Desktop/asistanapp/apps/panel/
   ```

2. **Make your changes** to the React panel source code

3. **Build the panel:**
   ```bash
   npm run build
   ```
   (Output: `./dist/`)

4. **Copy the built panel** to the website:
   ```bash
   rm -rf ~/Desktop/asistanapp-frontend/astro-site/public/demo
   cp -r dist ~/Desktop/asistanapp-frontend/astro-site/public/demo
   ```

5. **Fix asset paths** (replace `/assets/` with `/demo/assets/`):
   ```bash
   cd ~/Desktop/asistanapp-frontend/astro-site/public/demo
   sed -i 's|href="/assets/|href="/demo/assets/|g' index.html
   sed -i 's|src="/assets/|src="/demo/assets/|g' index.html
   ```

6. **Commit and push:**
   ```bash
   cd ~/Desktop/asistanapp-frontend/astro-site/
   git add public/demo/
   git commit -m "feat: update panel deployment to /demo"
   git push origin main
   ```
   
   **Cloudflare Pages will auto-rebuild and deploy.**

---

## Deployment

### Local Development

The demo is served automatically by Astro dev server:

```bash
cd astro-site/
npm run dev
# Visit http://localhost:4321/demo
```

### Production (Cloudflare Pages)

1. **Commit and push the changes** to `main` branch
2. **Cloudflare Pages** automatically deploys when:
   - New commits land on `main`
   - Updated `/public/demo/` files are included

3. **Demo becomes live** at:
   ```
   https://asistanapp.com.tr/demo
   ```

---

## Security Guarantees

### Static Content Only
- ✅ All files in `/public/demo/` are **100% static**
- ✅ No server-side code execution
- ✅ No environment variables exposed
- ✅ No API keys in source

### No Backend Access
- ✅ Demo is **completely isolated** from backend APIs
- ✅ No real user data is accessed
- ✅ No mutations or side effects
- ✅ Fully functional in-browser experience

### GDPR/Privacy Compliance
- ✅ No personal data is collected
- ✅ No tracking scripts (except site-wide Google Analytics)
- ✅ Demo is **stateless**

---

## Linking from Navigation

The "Demo" button is automatically added to the site header:

```astro
<!-- In src/components/Header.astro -->
<li>
  <a href="/demo" class="demo-link">
    <span data-i18n="tr">Demo</span>
    <span data-i18n="en">Demo</span>
  </a>
</li>
```

**Styling:** The demo link has a gradient background and hover animation (defined in Header.astro's `<style>` block).

---

## Testing the Demo Locally

```bash
# 1. Development server
npm run dev
# 2. Open browser → http://localhost:4321/demo
# 3. Verify interactive features work
# 4. Check browser DevTools → Network tab
#    → Confirm NO API calls to backend
```

---

## Troubleshooting

### Demo not showing up?
1. Check that `/public/demo/index.html` exists
2. Verify Astro dev server is running
3. Clear browser cache and reload

### Demo shows blank page?
1. Check browser console for JavaScript errors
2. Ensure all static assets (CSS, JS, images) are present in `/public/demo/`
3. Verify relative paths in demo HTML

### Demo has stale content?
1. Rebuild the source: `cd ~/Desktop/asistanapp-site-new/ && npm run build`
2. Copy new build: `cp -r dist/* ../asistanapp-frontend/astro-site/public/demo/`
3. Commit and push changes

---

## Contact

For questions about the demo integration, see the main `README.md` or reach out to the development team.
