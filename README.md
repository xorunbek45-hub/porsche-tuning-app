# Porsche Tuning App

Interactive Porsche-style 3D tuning configurator built with React, Vite, Three.js, React Three Fiber, Drei, and Framer Motion.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages

The app is configured with relative asset paths, so it can run from a GitHub Pages project URL such as:

```text
https://USERNAME.github.io/porsche-tuning-app/
```

After pushing to the `main` branch, the included GitHub Actions workflow builds the Vite app and publishes the `dist` folder to GitHub Pages.
