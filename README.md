# MovieNight 🎬

A modern, movie discovery application built with Next.js 14, TypeScript, and The Movie Database (TMDB) API.

## ✨ Features

- **Dynamic Hero Carousel**: Rotating showcase of top-rated trending movies with extracted color-based ambient glow effects
- **Intelligent Search**: Real-time search with movie thumbnails
- **Infinite Scroll**: Seamless browsing experience on search results pages
- **Responsive Movie Rows**: Horizontal scrollable movie collections
- **Movie Details**: Comprehensive movie information pages
- **Modern UI**: Clean, dark-themed interface with smooth animations and transitions

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Base UI (Uber's design system)
- **Styling Engine**: Styletron
- **API**: The Movie Database (TMDB) API
- **Image Optimization**: Next.js Image component

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css           # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home page with hero & movie rows
│   ├── results/              # Search results page
│   │   └── page.tsx
│   └── movie/
│       └── [id]/             # Dynamic movie detail pages
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   └── Header/           # Sticky header with logo and search
│   ├── movie/
│   │   ├── HeroSection/      # Rotating hero carousel
│   │   ├── MovieCard/        # Reusable movie card component
│   │   ├── MovieRow/         # Horizontal scrollable movie list
│   │   └── MovieDetail/      # Movie detail view
│   └── search/
│       ├── SearchBar/        # Search with autocomplete dropdown
│       └── Results/          # Search results with infinite scroll
│
├── services/
│   └── tmdb.ts               # TMDB API service layer
│
├── store/
│   └── movieStore.ts         # Zustand global state management
│
├── types/
│   └── movie.ts              # TypeScript type definitions
│
└── lib/
    ├── Providers.tsx         # Client-side providers (Styletron, BaseUI)
    └── styletron.ts          # Styletron configuration
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd idruide-movienight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_API_URL=https://api.themoviedb.org/3
   NEXT_PUBLIC_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
   ```

   Get your free API key from [The Movie Database](https://www.themoviedb.org/settings/api)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features Explained

### Hero Section
- Displays the top 3 best-rated trending movies
- Auto-rotates every 2.5 seconds
- Extracts dominant colors from movie backdrops for dynamic ambient glow
- Smooth vertical carousel transitions

### Search Functionality
- Real-time search with 300ms debounce
- Dropdown with up to 6 movie suggestions
- Shows poster thumbnails, titles, and release years
- "View all results" link for comprehensive search
- Sticky header that becomes translucent on scroll

### Movie Rows
- Horizontal scrollable lists with custom arrow navigation
- Smart opacity effects: cards fade when <90% visible
- Two main sections:
  - "À l'affiche cette semaine" (Trending this week)
  - "Les films les mieux notés" (Top rated movies with rating bars)

### Search Results Page
- Infinite scroll pagination
- Responsive grid layout (6 columns on desktop, adapts to screen size)
- Loading indicators and end-of-results messaging
- Displays total result count

## 🎨 Design Highlights

- **Dark Theme**: Primary background color `#2b2b2b`
- **Glassmorphism**: Search bar uses backdrop blur and transparency
- **Smooth Animations**: CSS transitions for hover effects and carousel movements
- **Responsive**: Adapts from mobile to desktop with grid breakpoints
- **Accessibility**: Proper ARIA labels and semantic HTML

## 📦 Dependencies

### Core
- `next`: ^14.x
- `react`: ^18.x
- `typescript`: ^5.x

### UI & Styling
- `baseui`: Icon components and design system
- `styletron-engine-atomic`: CSS-in-JS styling
- `styletron-react`: React bindings for Styletron
- `tailwindcss`: Utility-first CSS framework

### State Management
- `zustand`: Lightweight state management

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 API Integration

The app uses TMDB API v3 with the following endpoints:

- `GET /trending/movie/week` - Trending movies this week
- `GET /movie/top_rated` - Top rated movies of all time
- `GET /search/movie` - Search movies by query
- `GET /movie/{id}` - Get detailed movie information

## 📱 Responsive Breakpoints

- **Desktop**: 6 columns (>1400px)
- **Large Tablet**: 5 columns (1200px - 1400px)
- **Tablet**: 4 columns (900px - 1200px)
- **Small Tablet**: 3 columns (600px - 900px)
- **Mobile**: 2 columns (<600px)

## 📄 License

This project is for personal purposes as part of an interview assignment.

## 🙏 Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons from [Base UI](https://baseweb.design/)
- Inspired by Netflix's user interface

---

**Note**: This project requires a valid TMDB API key to function. Sign up for free at [themoviedb.org](https://www.themoviedb.org/).