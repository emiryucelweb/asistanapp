# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1️⃣ Install Dependencies (30 seconds)

```bash
cd asistanapp-site-new
npm install
```

### 2️⃣ Start Development Server (10 seconds)

```bash
npm run dev
```

Open your browser to **http://localhost:3001**

### 3️⃣ Make Changes & See Live Updates

The development server has hot module replacement (HMR) enabled. Any changes you make will be reflected instantly in the browser.

---

## 📝 Common Tasks

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Opens a local server to preview the built site.

### Add Demo Panel

1. Build your panel demo from the main project
2. Copy build files to `demo/` folder
3. Uncomment iframe in `src/components/DemoSection.tsx`

---

## 🎨 Customize Content

| File | What to Edit |
|------|--------------|
| `src/components/Hero.tsx` | Main headline, tagline, CTAs |
| `src/components/Features.tsx` | Feature list and descriptions |
| `src/components/DemoSection.tsx` | Demo instructions |
| `src/components/Footer.tsx` | Footer links and copyright |

---

## 🎯 Project Structure at a Glance

```
asistanapp-site-new/
├── 📄 index.html          ← HTML entry point
├── 📦 package.json        ← Dependencies
├── ⚙️  vite.config.ts      ← Build config
├── 📖 README.md           ← Full documentation
├── src/
│   ├── 🚀 main.tsx        ← React entry
│   ├── 📱 App.tsx         ← Main component
│   └── components/        ← Page sections
├── public/                ← Static assets
└── demo/                  ← Panel demo (add later)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts without errors
- [ ] Site opens at http://localhost:3001
- [ ] All sections render correctly (Hero, Features, Demo, Footer)
- [ ] Layout is responsive (try resizing browser)
- [ ] No console errors in browser DevTools

---

## 🆘 Having Issues?

### Port 3001 Already in Use

Edit `vite.config.ts` and change the port:
```typescript
server: {
  port: 3002, // Change this
}
```

### Build Errors

Clear everything and reinstall:
```bash
rm -rf node_modules dist
npm install
```

### Module Not Found

Make sure you're in the correct directory:
```bash
pwd  # Should show: .../asistanapp/asistanapp-site-new
```

---

## 📚 Next Steps

1. ✅ **Customize Content** - Update text and images
2. ✅ **Add Demo** - Include the actual panel demo
3. ✅ **Deploy** - Push to production hosting
4. ✅ **Monitor** - Add analytics and monitoring

See the full [README.md](./README.md) for detailed documentation.

---

**Ready to ship!** 🎉
