# ArtVista 🎨

**ArtVista** is a modern, premium digital art gallery application that allows users to explore, filter, and collect artworks from world-renowned museums, powered by the [Art Institute of Chicago API](https://api.artic.edu/).

![ArtVista App](https://via.placeholder.com/800x400?text=ArtVista+Preview)

## ✨ Features

- **Explore Gallery**: Browse thousands of artworks with high-resolution images.
- **Advanced Filtering**: Search by keyword, artist, or style with optimized debounce.
- **Deep Zoom**: View rich details including provenance, dimensions, and history.
- **Personal Collections**: Create and manage your own curated collections (persisted locally).
- **Responsive Design**: Premium mobile-first experience with smooth animations.
- **Interactive UI**: Elegant transitions, loading states, and error handling.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router v6 (Client-side routing)
- **State Management**: React Context API & Custom Hooks
- **Styling**: Tailwind CSS (Custom theme configuration)
- **API**: Art Institute of Chicago public API
- **Fonts**: Google Fonts (Playfair Display & Inter)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/artvista.git
   cd artvista
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── artwork/       # Artwork cards, grids, and detail modals
│   ├── collections/   # Collection management components
│   ├── common/        # Reusable UI components (ErrorDisplay, etc.)
│   ├── filters/       # Search and filter sidebars
│   └── layout/        # Main layout and navigation
├── context/           # Global state (CollectionsContext)
├── hooks/             # Custom hooks (useFetchArtworks, useDebounce, etc.)
├── pages/             # Route components (Home, Explore, Collections)
├── routes/            # App routing configuration
├── services/          # API integration services
└── utils/             # Helper functions and normalizers
```

## 🎓 Learning Outcomes

This project was built as a capstone for Week 4 React, demonstrating mastery of:
- **Custom Hooks**: Encapsulating logic for data fetching (`useFetchArtworks`) and UI behavior (`useDebounce`).
- **Context API**: Managing global application state for user collections without prop drilling.
- **Client-Side Routing**: Implementing nested routes and layouts with React Router v6.
- **Component Architecture**: Building reusable, single-responsibility functional components.
- **API Integration**: Handling asynchronous data, loading states, and errors gracefully.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by [Your Name] for the HackYourFuture React Module.*
