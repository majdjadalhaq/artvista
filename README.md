# ArtVista 🎨

**ArtVista** is a modern, responsive digital art gallery that aggregates masterpieces from the **Art Institute of Chicago** and **Europeana**. It features a "Museum Dark" aesthetic, cinematic animations, and a seamless user experience.

## ✨ Key Features

### 🖼️ Dual-API Aggregation
- **Unified Feed**: Seamlessly merges data from two different museum APIs into a consistent format.
- **Robust Error Handling**: "Try Again" mechanisms and skeleton loaders ensure smoothness even during network hiccups.

### 🎥 Cinematic Motion
- **Page Transitions**: Smooth slide and fade effects when navigating between views.
- **Staggered Grid**: Artworks cascade into view for a premium feel.
- **Micro-Interactions**: Satisfying "pop" effects on buttons and tactile hover states.

### 🏛️ Premium UI/UX
- **Curated Collections**: Save your favorite artworks to your local gallery (persisted via LocalStorage).
- **Responsive Design**: precise layouts for Mobile, Tablet, and Desktop, including a custom animated hamburger menu.
- **Dark/Light Mode**: Fully themable interface with carefully tuned contrast variables.

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion, GSAP
- **Data**: Art Institute of Chicago API, Europeana API
- **Icons**: Lucide React
- **Routing**: React Router v6

## ✅ Scope & Requirements

### MUST-HAVE
1. Home page with featured artworks and CTA to Explore
2. Explore grid with artworks from Art Institute of Chicago and Europeana
3. Filters: keyword, artist, and era (live-updating)
4. Collections: Add/remove artworks with persistence via LocalStorage
5. Client-side routing with React Router v6
6. State via Context API and custom hooks

### NICE-TO-HAVE
- Hover effects and tasteful micro-animations
- Keyboard navigation in the Explore grid
- Skeleton loaders during fetches
- Clear error/no-result messages

## 🔐 Environment Setup

Create a `.env` file in the project root based on `.env.example`:

```
VITE_EUROPEANA_API_KEY=your_key_here
```

Notes:
- A demo key fallback (`api2demo`) is used if the key is not provided for Europeana.
- Art Institute of Chicago API does not require a key.

## 📂 Project Structure

```
src/
├── components/
│   ├── animations/      # PageTransition, ParticleBackground
│   ├── artwork/         # ArtworkCard, ArtworkGrid
│   ├── filters/         # FilterBar
│   ├── layout/          # Header, Layout wrappers
│   └── ui/              # Toast, ToastContainer
├── context/
│   ├── CollectionContext.jsx  # Favorite artworks state
│   ├── ThemeContext.jsx       # Dark/Light mode state
│   └── ToastContext.jsx       # Notification system
├── hooks/
│   ├── useArtworks.js         # Unified data fetching logic
│   ├── useInfiniteScroll.js   # Pagination logic
│   └── useLocalStorage.jsx    # Persistence hook
├── pages/
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── ArtworkDetail.jsx
│   ├── Collection.jsx
│   └── About.jsx
└── services/
    ├── artInstituteApi.js
    └── europeanaApi.js
```

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/artvista.git
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Run the development server**
    ```bash
    npm run dev
    ```
4.  **Build for Production**
    ```bash
    npm run build
    ```

5. **Run tests**
    ```bash
    npm test
    ```

## 🧪 Testing

- Unit tests live under `src/hooks` and `src/components` (Vitest + Testing Library)
- To run in watch mode: `npm test`

## 🖼️ Screenshots / Demo

- Add screenshots or a short GIF/video of the Explore page, filters, and collections.
- If deployed, include the live link here.

## 🌐 APIs & Data Notes

- Art Institute of Chicago and Europeana results are normalized to a common shape.
- Network resilience:
  - AbortController to cancel stale requests on query changes.
  - Exponential backoff retry for transient failures.
- Rate limits: The app debounces user input and performs incremental pagination.

## ♿ Accessibility & UI

- Semantic roles and labels on interactive elements.
- Focusable cards and buttons; keyboard navigation planned for Explore grid.
- High-contrast dark theme with readable typography.

## ⚙️ Performance

- Virtualized grid using `react-window` renders only visible artworks.
- Lazy-loaded, responsive images with `sizes/srcSet` for IIIF sources.
- Sliding window keeps only the latest ~200 items in memory to bound render cost.
- Debounced search input and memoized filters/facets.

## ⚠️ Known Limitations

- Europeana preview images vary in size/quality depending on source records.
- Some artworks lack complete metadata (artist/year/medium), which affects filters.

## 🎨 Design Philosophy

**"Curating the World's Beauty"**
We aimed to create an interface that steps back and lets the art shine. The UI uses glassmorphism, subtle gradients, and plenty of whitespace (or darkspace) to frame the masterpieces.
