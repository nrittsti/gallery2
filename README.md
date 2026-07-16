# Nico's Photo Gallery

A modern, responsive photography gallery built with React, TypeScript, and Vite. Features a clean dark theme, lightbox viewer, and automatic photo processing pipeline.

## 🖼️ Features

- **Responsive Grid Layout**: Masonry-style photo grid with Bootstrap
- **Year Filtering**: Filter photos by year
- **Lightbox Viewer**: Full-screen photo viewer with EXIF metadata display
- **Automatic Processing**: Bash script for batch photo processing and metadata extraction
- **Dark Theme**: Default Bootstrap dark theme
- **EXIF Metadata**: Display camera settings and technical details

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- ImageMagick (for photo processing)
- ExifTool (for metadata extraction)
- Bash 5+
- gawk
- jq

### Installation

```bash
npm install
```

### Development
```bash
# Start vite development server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Verification Commands (Gate Order)
```bash
# 1. Lint — check code quality
npm run lint

# 2. Build — compile TypeScript and bundle
npm run build

# 3. Unit Tests — validate components and hooks (Vitest + React Testing Library)
npm run test:unit

# 4. E2E Tests — browser-level behavior (Playwright)
npm run test:e2e
```

The canonical verification gate order is **lint → build → unit → e2e**. CI enforces the same order. Run all gates before committing to catch regressions early.

### Unit Test Commands
```bash
# Run all unit tests (Vitest)
npm run test:unit

# Run unit tests in watch mode for development
npm run test:unit:watch
```

Unit tests live in `tests/unit/` and use Vitest with React Testing Library and jsdom.

### E2E Test Commands
```bash
# Run all E2E tests (Chromium + Firefox)
npm run test:e2e

# Run in a specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox

# Open Playwright UI mode for debugging
npm run test:e2e:ui
npm run test:e2e:debug

# View the last test report
npm run test:e2e:report
```

E2E tests live in `tests/e2e/`. 

## 📁 Project Structure
```
gallery/ 
├── input/ # Original photos (organized by year/month) 
├── src/ 
│ ├── assets/ # Processed images and JSON data 
│ │ ├── grid/ # Thumbnails (600x600) 
│ │ ├── lightbox/ # Full-size images (max 1600px height) 
│ │ └── photos.json # Photo metadata database 
│ ├── components/ # React components 
│ │ ├── Gallery.tsx # Main photo grid 
│ │ ├── Lightbox.tsx # Full-screen viewer 
│ │ ├── Navigation.tsx # Year filter navigation 
│ │ └── Footer.tsx # Site footer 
│ ├── context/ # React context providers 
│ ├── hooks/ # Custom React hooks 
│ └── types/ # TypeScript type definitions 
├── public/ # Static assets 
├── create_thumbnails.sh # Photo processing script 
└── package.json # Dependencies and scripts
```

## 🖼️ Photo Processing

### Adding New Photos

See [`MAINTENANCE.md`](MAINTENANCE.md) for the complete maintenance and release checklist.

### Adding Photos (Quick Reference)

1. Place original photos in `input/[year]/[month]/` directory
  - Supported formats: JPG, HEIC
  - Naming convention: `YYYY-MM-DD_HH-MM-SS.jpg`

2. Run the processing script:

```bash
bash ./create_thumbnails.sh
``` 

### What the Script Does

1. **Creates thumbnails**: 600x600px cropped squares for grid view
2. **Creates lightbox images**: Resized to max 1600px height for full-screen viewing
3. **Extracts metadata**: Uses ExifTool to get camera settings and technical data
4. **Generates JSON database**: Creates `src/assets/photos.json` with all photo information

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript 5.9
- **Build Tool**: Vite 7.2
- **UI Framework**: React Bootstrap 2.10, Bootstrap Icons
- **Styling**: Bootstrap 5.3 (dark theme), custom CSS
- **Code Quality**: ESLint 9.39, TypeScript ESLint
- **Photo Processing**: ImageMagick, ExifTool

## 📱 Features in Detail

### Gallery Component
- Responsive grid with Bootstrap's Row/Col system
- Lazy loading images for performance
- Click to open lightbox
- Year filtering via React Context

### Lightbox Component
- Full-screen photo viewer
- Navigation arrows (previous/next)
- Close button and keyboard shortcuts (ESC, arrow keys)
- EXIF metadata display (camera model, lens, settings)

### Navigation
- Fixed top navigation bar
- Year filter buttons
- Active state highlighting
- Mobile-responsive collapse

### Performance Optimizations
- `React.memo()` for Footer component
- `useMemo()` for filtered photo calculations
- Lazy loading with `loading="lazy"` attribute
- Optimized image sizes (thumbnails and lightbox variants)

## 🛠️ Development

### TypeScript Configuration
- Strict type checking enabled
- Separate configs for app and Node.js
- Path aliases configured in Vite

### Styling
- Bootstrap dark theme (`data-bs-theme="dark"`)
- Custom CSS for gallery cards and backgrounds
- Responsive utilities for mobile-first design

### State Management
- React Context for global state (filter, lightbox)
- Local state for UI interactions
- Custom hooks for photo data fetching

## 📄 License

All code files are under **GNU General Public** License.  
All photos are under **CC BY-NC-ND** License (Attribution-NonCommercial-NoDerivatives).

## 👤 Author

**Nico Rittstieg**

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for responsive components
- [React Bootstrap](https://react-bootstrap.github.io/) for React integration
- [ImageMagick](https://imagemagick.org/) for image processing
- [ExifTool](https://exiftool.org/) for metadata extraction

---

*Built with ❤️ using modern web technologies*
```
