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

## 🎨 Design Philosophy

**"Curating the World's Beauty"**
We aimed to create an interface that steps back and lets the art shine. The UI uses glassmorphism, subtle gradients, and plenty of whitespace (or darkspace) to frame the masterpieces.
