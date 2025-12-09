# Deployment Guide

Complete guide for deploying the AsistanApp Demo Site to various hosting platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All content is finalized and reviewed
- [ ] Demo panel is built and placed in `/demo` folder
- [ ] Images and assets are optimized
- [ ] Environment variables are configured (if any)
- [ ] Build completes successfully: `npm run build`
- [ ] Production preview works: `npm run preview`
- [ ] No console errors in browser
- [ ] All links are functional
- [ ] Mobile responsiveness verified

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite projects
- Automatic SSL/HTTPS
- Global CDN
- Preview deployments for PRs
- Free tier available

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd asistanapp-site-new
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project or create new
   - Confirm settings (auto-detected)
   - Deploy!

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

**Automatic Deployment:**
- Connect GitHub repository to Vercel
- Vercel will auto-deploy on every push to main branch

**Custom Domain:**
- Go to Vercel dashboard
- Project Settings → Domains
- Add your custom domain
- Update DNS records

---

### Option 2: Netlify

**Why Netlify?**
- Simple drag-and-drop deployment
- Continuous deployment from Git
- Form handling built-in
- Free tier with generous limits

**Steps:**

**Method A: Drag & Drop**
1. Build the project: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder
4. Done!

**Method B: CLI**
1. Install Netlify CLI
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy
   ```bash
   netlify deploy --prod --dir=dist
   ```

**Method C: Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatically on every push

**Custom Domain:**
- Domain Settings in Netlify dashboard
- Add custom domain
- Configure DNS

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free hosting for GitHub repositories
- Simple setup
- Good for open-source projects

**Steps:**

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   Set base path to repo name:
   ```typescript
   export default defineConfig({
     base: '/asistanapp-site-new/', // Your repo name
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings
   - Pages section
   - Source: gh-pages branch
   - Save

**Custom Domain:**
- Add CNAME file to public/ folder
- Configure DNS at your domain provider

---

### Option 4: Cloudflare Pages

**Why Cloudflare Pages?**
- Global CDN
- Free unlimited bandwidth
- DDoS protection
- Fast builds

**Steps:**

1. **Push to Git repository**
   (GitHub, GitLab, or Bitbucket)

2. **Connect to Cloudflare Pages**
   - Go to Cloudflare dashboard
   - Pages → Create a project
   - Connect your Git account
   - Select repository

3. **Configure Build**
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **Deploy**
   - Click "Save and Deploy"
   - Automatic deployments on every push

**Custom Domain:**
- Pages → Custom domains
- Add domain
- Update nameservers to Cloudflare

---

### Option 5: AWS S3 + CloudFront

**Why AWS?**
- Enterprise-grade infrastructure
- Scalable and reliable
- Integration with other AWS services

**Steps:**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create bucket (e.g., `asistanapp-demo`)
   - Enable static website hosting
   - Set public access policies

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://asistanapp-demo/
   ```

4. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Set default root object: `index.html`

5. **Configure DNS**
   - Point domain to CloudFront URL
   - Wait for propagation

**Automation:**
Create a deploy script:
```bash
#!/bin/bash
npm run build
aws s3 sync dist/ s3://asistanapp-demo/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### Option 6: Traditional Web Server

**For Apache, Nginx, or any HTTP server:**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload dist/ folder to server**
   ```bash
   scp -r dist/* user@server:/var/www/html/
   ```

3. **Configure Server**

   **Apache (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     root /var/www/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

---

## 🔐 Environment Variables

If you need environment variables:

1. **Create `.env.production`**
   ```env
   VITE_API_URL=https://api.example.com
   VITE_DEMO_TENANT=demo-tenant-id
   ```

2. **Access in code:**
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. **Set in hosting platform:**
   - **Vercel:** Environment Variables in dashboard
   - **Netlify:** Build & deploy → Environment variables
   - **Cloudflare:** Settings → Environment variables

---

## 🔧 Build Optimization

Before deploying to production:

1. **Enable Build Optimizations**
   
   Already configured in `vite.config.ts`:
   - Minification enabled
   - Code splitting
   - Asset optimization

2. **Analyze Bundle Size**
   ```bash
   npm install -D rollup-plugin-visualizer
   ```
   
   Add to vite.config.ts:
   ```typescript
   import { visualizer } from 'rollup-plugin-visualizer';
   
   plugins: [
     react(),
     visualizer()
   ]
   ```

3. **Image Optimization**
   - Compress images before adding
   - Use WebP format when possible
   - Lazy load images

---

## 📊 Post-Deployment

### Monitoring

1. **Add Analytics**
   - Google Analytics
   - Plausible
   - Simple Analytics

2. **Error Tracking**
   - Sentry
   - Rollbar
   - LogRocket

3. **Performance Monitoring**
   - Lighthouse CI
   - WebPageTest
   - GTmetrix

### SEO

1. **Add meta tags** in `index.html`
2. **Create sitemap.xml**
3. **Submit to Google Search Console**
4. **Add robots.txt**

### SSL/HTTPS

All recommended platforms provide free SSL:
- Vercel: Automatic
- Netlify: Automatic
- Cloudflare: Automatic
- AWS: Use ACM (AWS Certificate Manager)

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 on Routes

- Ensure server is configured for SPA
- Check base path in vite.config.ts
- Verify .htaccess or nginx config

### Assets Not Loading

- Check base URL in vite.config.ts
- Verify asset paths are relative
- Check browser console for errors

### Slow Load Times

- Enable gzip/brotli compression
- Use CDN for assets
- Optimize images
- Enable caching headers

---

## 📝 Deployment Checklist

- [ ] Code is committed and pushed
- [ ] Build succeeds locally
- [ ] All tests pass (if any)
- [ ] Environment variables set
- [ ] Domain/subdomain configured
- [ ] SSL certificate installed
- [ ] Analytics configured
- [ ] Error tracking set up
- [ ] Performance tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser tested
- [ ] SEO meta tags added

---

## 🎯 Recommended Setup

For the AsistanApp demo site, we recommend:

**Development:** Local (npm run dev)
**Staging:** Vercel preview deployments
**Production:** Vercel or Netlify

This provides:
- Automatic deployments
- Preview URLs for PRs
- Global CDN
- Free SSL
- Easy rollbacks
- Zero configuration

---

## 📞 Need Help?

- Check platform-specific documentation
- Review error logs in platform dashboard
- Test build locally first
- Verify all paths are correct
- Check browser console for errors

---

*Last Updated: December 2025*
