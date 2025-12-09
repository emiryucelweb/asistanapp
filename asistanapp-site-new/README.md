# AsistanApp Demo Site

A modern, standalone static website to showcase the AsistanApp Panel demo. This project is completely isolated from the main panel application and serves as a marketing/demo landing page.

## 🎯 Purpose

This site provides:
- A marketing landing page for AsistanApp Panel
- Feature highlights and product information
- An embedded demo environment for the panel application
- Responsive, modern design optimized for all devices

## 📁 Project Structure

```
asistanapp-site-new/
├── index.html              # Main HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript config for Node
├── package.json            # Dependencies and scripts
├── README.md               # This file
├── src/                    # Source code
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Main App component
│   ├── App.css             # App-level styles
│   ├── index.css           # Global styles
│   └── components/         # React components
│       ├── Hero.tsx        # Hero section
│       ├── Hero.css
│       ├── Features.tsx    # Features section
│       ├── Features.css
│       ├── DemoSection.tsx # Demo embed section
│       ├── DemoSection.css
│       ├── Footer.tsx      # Footer
│       └── Footer.css
├── public/                 # Static assets (optional)
├── demo/                   # Demo panel build (to be added)
└── dist/                   # Production build output
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- No other dependencies on the main panel project

### Installation

1. Navigate to this directory:
   ```bash
   cd asistanapp-site-new
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3001`

### Building for Production

Build the static site:
```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

After building, preview the production build locally:
```bash
npm run preview
```

## 🎨 Features

### Current Implementation

- ✅ Modern React + Vite setup
- ✅ TypeScript support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Hero section with call-to-action
- ✅ Features showcase section
- ✅ Demo section with iframe placeholder
- ✅ Footer with links and information
- ✅ Clean, professional styling
- ✅ Fast build and development experience

### Planned Enhancements

- [ ] Add actual demo panel embed
- [ ] Include screenshots/videos
- [ ] Add contact form
- [ ] Implement dark mode
- [ ] Add animations and transitions
- [ ] SEO optimization
- [ ] Analytics integration

## 📦 Adding the Demo Panel

To embed the actual AsistanApp Panel demo:

### Step 1: Build the Demo Panel

From the main panel project (not this site):

```bash
# Build the panel with demo configuration
npm run build:demo
```

This should create a `dist-demo` folder with the compiled panel.

### Step 2: Copy Demo Files

Copy the built demo files to this site:

```bash
# From the main panel directory
cp -r dist-demo/* ../asistanapp-site-new/demo/
```

### Step 3: Update Demo Section

The demo will automatically be accessible at `/demo/index.html`

To enable the iframe embed:

1. Open `src/components/DemoSection.tsx`
2. Uncomment the iframe code (around line 46)
3. Comment out or remove the placeholder

```tsx
<iframe
  src="/demo/index.html"
  className="demo-iframe"
  title="AsistanApp Panel Demo"
  sandbox="allow-scripts allow-same-origin allow-forms"
/>
```

### Step 4: Rebuild the Site

```bash
npm run build
```

## 🌐 Deployment

This is a standard static site that can be deployed to any static hosting service:

### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. Build the site: `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Option 4: Any Static Host

Simply upload the contents of the `dist/` folder to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages
- Or any web server

## 🔧 Configuration

### Vite Configuration

Edit `vite.config.ts` to customize:
- Base URL for deployment
- Build output directory
- Asset handling
- Dev server port

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_API_URL=https://api.example.com
VITE_DEMO_TENANT_ID=demo-tenant
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📝 Customization

### Styling

- Global styles: `src/index.css`
- Component-specific styles: `src/components/*.css`
- CSS variables defined in `src/index.css` for easy theming

### Content

Edit the following files to update content:
- `src/components/Hero.tsx` - Hero section text and CTAs
- `src/components/Features.tsx` - Feature list and descriptions
- `src/components/DemoSection.tsx` - Demo instructions and info
- `src/components/Footer.tsx` - Footer links and information

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/App.tsx`
3. Style it with a corresponding CSS file

## 🚨 Important Notes

### Isolation from Main Project

- ✅ This project is **completely independent** from the main panel
- ✅ No imports from parent directories
- ✅ No shared dependencies or configurations
- ✅ Can be developed, built, and deployed separately
- ✅ Safe to modify without affecting the main panel

### Do Not Modify Main Panel

- ❌ Do not edit files outside this directory
- ❌ Do not import code from `../apps/panel/`
- ❌ Do not share build configurations
- ❌ Keep this project self-contained

## 🛠️ Troubleshooting

### Port Already in Use

If port 3001 is in use, change it in `vite.config.ts`:

```typescript
server: {
  port: 3002, // Or any available port
}
```

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Demo Not Loading

1. Verify demo files exist in `/demo` folder
2. Check browser console for errors
3. Ensure iframe src path is correct
4. Check CORS settings if loading from different origin

## 📚 Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite 5** - Build tool and dev server
- **CSS3** - Styling (no frameworks for simplicity)

## 📄 License

Same as the main AsistanApp project.

## 🤝 Contributing

1. Make changes in this directory only
2. Test locally with `npm run dev`
3. Build and verify with `npm run build && npm run preview`
4. Submit PR with changes confined to `asistanapp-site-new/`

## 📞 Support

For questions or issues related to this demo site:
- Check the main project documentation
- Review this README
- Contact the development team

---

**Last Updated:** December 2025  
**Version:** 1.0.0
