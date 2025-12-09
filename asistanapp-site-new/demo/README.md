# Demo Panel Files

This folder is where you should place the built AsistanApp Panel demo application.

## How to Add Demo Files

1. Build your panel with demo configuration from the main project:
   ```bash
   npm run build:demo
   ```

2. Copy the contents of `dist-demo/` to this folder:
   ```bash
   cp -r dist-demo/* demo/
   ```

3. The structure should look like:
   ```
   demo/
   ├── index.html
   ├── assets/
   │   ├── *.js
   │   ├── *.css
   │   └── ...
   └── ...
   ```

4. The demo will be accessible at `/demo/index.html`

## Important Notes

- This folder should contain ONLY the built demo panel files
- Do not commit large demo build files to git (they're in .gitignore)
- Ensure the demo is configured with demo tenant credentials
- The demo should work standalone without requiring API connections

## Placeholder

Until you add the demo build, the site will display a placeholder message with instructions.
