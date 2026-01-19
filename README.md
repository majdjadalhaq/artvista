# ArtVista 🎨

A premium art exploration web application showcasing masterpieces from world-renowned museums. Built with React, featuring advanced animations, intelligent filtering, and personalized collections.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/React-18.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Project Overview

ArtVista is a modern, museum-quality web application that allows users to explore, discover, and collect artworks from multiple public art APIs. The project demonstrates mastery of React fundamentals, state management, routing, API integration, and modern animation techniques.

**Created as part of HackYourFuture React Module - Week 4 Final Project**

## ✨ Features

### Must-Have Features (Core Requirements)
- 🏠 **Multi-page Application**: Home, Explore, Collections, and About pages
- 🧭 **Client-side Routing**: Seamless navigation with React Router DOM v6
- 🎯 **Context API**: Global state management for collections
- 🪝 **Custom Hooks**: Reusable logic for data fetching, debouncing, and state
- 🌐 **Public API Integration**: Art Institute of Chicago + Europeana APIs
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 💾 **Persistent Storage**: Collections saved to localStorage

### Advanced Features
- 🎬 **Cinematic Animations**: Framer Motion + GSAP for smooth, professional motion
- 🔍 **Smart Filtering**: Search by keyword, artist, medium, and era
- ⌨️ **Keyboard Navigation**: Full accessibility support
- 🎨 **Museum-inspired Design**: Premium aesthetic with custom color palette
- 🖼️ **Detail Modal**: Full-screen artwork view with metadata
- 📚 **Collection Management**: Create, organize, and manage multiple collections

## 🛠️ Tech Stack

### Core
- **React 18.3** - UI library (functional components only)
- **Vite 7.3** - Build tool and dev server
- **React Router DOM 6** - Client-side routing

### Styling & Animation
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion 11** - React animation library
- **GSAP 3.12** - Professional-grade animation platform

### APIs
- **Art Institute of Chicago API** - Primary artwork data source
- **Europeana API** - Supplementary European art collections

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control with feature branch workflow

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/artvista.git
cd artvista

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
ArtVista/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, fonts
│   ├── components/      # Reusable UI components
│   ├── contexts/        # Context API providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route-level page components
│   ├── services/        # API integration layer
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles + Tailwind
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Canvas**: `#F8F7F5` - Soft off-white background
- **Text Primary**: `#1A1A1A` - Deep charcoal
- **Text Secondary**: `#4A4A4A` - Medium gray
- **Accent Primary**: `#8B7355` - Warm brown
- **Accent Secondary**: `#C4A57B` - Light gold

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (paragraphs, UI)

### Animation Philosophy
- **Cinematic**: Smooth, purposeful motion
- **Timing**: 300-800ms for most transitions
- **Easing**: Custom cubic-bezier curves for natural feel
- **Scroll-based**: GSAP ScrollTrigger for parallax effects

## 🔌 API Documentation

### Art Institute of Chicago
```javascript
// Search artworks
GET https://api.artic.edu/api/v1/artworks/search?q={query}&limit=40

// Get artwork details
GET https://api.artic.edu/api/v1/artworks/{id}

// Image URL format
https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg
```

### Europeana (Supplementary)
```javascript
// Search artworks
GET https://api.europeana.eu/record/v2/search.json?wskey={key}&query={query}&rows=20
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if implemented)
npm run test:e2e
```

## 📝 Development Workflow

This project follows a professional Git workflow with feature branches:

1. **Feature Branch**: `git checkout -b feature/phase-X-description`
2. **Commit Often**: Descriptive commit messages following conventional commits
3. **Merge to Main**: `git merge --no-ff feature/phase-X-description`
4. **Tag Releases**: `git tag -a v0.X.0 -m "Phase X complete"`

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Adding tests

## 🎯 Project Requirements Checklist

- [x] Multiple pages with client-side routing
- [x] Context API for state management
- [x] Custom hooks for reusable logic
- [x] Public API integration (Art Institute of Chicago + Europeana)
- [x] No class components (functional components only)
- [x] Original implementation (not a tutorial)
- [x] Professional README with setup instructions
- [ ] Testing (in progress)
- [ ] Deployed to production

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React
- [x] Tailwind CSS configuration
- [x] Folder structure
- [x] Git initialization

### Phase 2-10: In Progress
See [implementation_plan.md](./docs/implementation_plan.md) for detailed roadmap.

## 🤝 Contributing

This is a student project for HackYourFuture, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **HackYourFuture** - For the curriculum and mentorship
- **Art Institute of Chicago** - For providing the public API
- **Europeana** - For supplementary art data
- **Design Inspiration** - Modern museum websites and digital galleries

## 📧 Contact

**Majd Jadalhaq**
- GitHub: [@yourusername](https://github.com/yourusername)
- Project Link: [https://github.com/yourusername/artvista](https://github.com/yourusername/artvista)

---

**Built with ❤️ as part of HackYourFuture React Module**
