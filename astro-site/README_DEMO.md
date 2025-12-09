# Demo Site Integration

## Overview

The `/demo` route serves a **100% static** interactive demo of the AsistanApp platform. This is a completely isolated, client-side application with **NO backend API calls**.

**Location:** `/public/demo/` (statically served by Astro)

**Public URL:** `https://asistanapp.com.tr/demo`

---

## What is the Demo?

The demo site is a **standalone Vite/React application** that demonstrates:
- Interactive UI mockups of AsistanApp features
- Chat interface simulations
- User flow demonstrations
- Static content only

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
│   └── demo/                      # <-- Static demo content (built Vite app)
│       ├── index.html
│       ├── README.md
│       └── (other static assets)
└── README_DEMO.md                 # <-- This file
```

---

## How to Update the Demo

### Source Location
The **original source** of the demo site is located at:
```
~/Desktop/asistanapp-site-new/
```

This is a **Vite/React project** with its own `package.json`, source code, and build process.

### Update Workflow

1. **Navigate to the source project:**
   ```bash
   cd ~/Desktop/asistanapp-site-new/
   ```

2. **Make your changes** to the React source code in `src/`

3. **Build the demo:**
   ```bash
   npm run build
   ```

4. **Copy the built files** to the website:
   ```bash
   cp -r dist/* ~/Desktop/asistanapp-frontend/astro-site/public/demo/
   ```

5. **Commit and push the changes:**
   ```bash
   cd ~/Desktop/asistanapp-frontend/astro-site/
   git add public/demo/
   git commit -m "chore: update demo site"
   git push origin main
   ```

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
