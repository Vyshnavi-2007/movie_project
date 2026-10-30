# CineVerse – Movie Discovery & Audience Reviews

A full-stack, cinematic movie discovery and management web application built for a 3rd-Year B.Tech Computer Science and Engineering (CSE) academic project demonstration.

The platform provides a dual-portal architecture:
1. **User Portal**: Cinematic discovery experience for browsing films across **Tollywood (Telugu)**, **Bollywood (Hindi)**, **Hollywood (English)**, and **Anime (Japanese)**, searching across all categories, filtering, viewing movie details, watching working YouTube trailers, and submitting audience reviews with an independent 5-star rating system.
2. **Admin Portal**: Clean, dedicated management console for performing full CRUD operations on Movies, Genres, and Audience Reviews via **JSON Server**, without any distracting statistical dashboards.

---

## 🌟 Key Features

### 🎬 1. User Portal (Discovery & Streaming Showcase)
- **Cinematic Hero Banner**: Features high-resolution backdrops, audience ratings out of 5, synopses, and direct buttons for official trailers and details.
- **Genuine Movie Collections (All 4 Categories Populated)**:
  - **Tollywood (Telugu)**: RRR, Pushpa 2: The Rule, Kalki 2898 AD, Devara: Part 1, Hi Nanna, Sita Ramam
  - **Bollywood (Hindi)**: 3 Idiots, Dangal, Jawan, Stree 2, Laapataa Ladies, Zindagi Na Milegi Dobara
  - **Hollywood (English)**: Inception, Interstellar, The Dark Knight, Dune: Part Two, Inside Out 2, Spider-Man: Across the Spider-Verse
  - **Anime (Japanese Animation)**: Your Name., Spirited Away, A Silent Voice, Suzume, Demon Slayer: Mugen Train, The Boy and the Heron
- **Single Universal Search Bar**: Located exclusively in the header navbar, searches across all four categories in real time.
- **Working Embedded YouTube Movie Trailers**: Official YouTube trailers embedded directly in 16:9 on each movie's details page.
- **Independent 5-Star Audience Ratings & Reviews**:
  - All TMDB scores and ratings completely removed.
  - Interactive 5-star rating submission form.
  - Pre-seeded sample demonstration audience reviews for all 24 movies with fictional usernames.
  - Full CRUD: Users can submit, edit, and delete reviews.

### 🛡️ 2. Admin Portal (`/admin/movies`)
Strictly adheres to project requirements with **NO statistical dashboards, analytics charts, or vanity metric cards**:
- **Admin Navigation**: Contains strictly 5 links:
  1. `Movies` (`/admin/movies`)
  2. `Add Movie` (`/admin/movies/new`)
  3. `Genres` (`/admin/genres`)
  4. `Reviews` (`/admin/reviews`)
  5. `Back to User Portal` (`/`)
- **Movie Management**:
  - View all movies in a structured table with poster thumbnails, titles, genres, industries, and ratings
  - **Add Movie**: Allows manual entry OR **1-click auto-fill from TMDB** (search any real movie on TMDB to auto-populate title, synopsis, poster, backdrop, runtime, release date, and ratings)
  - **Edit Movie**: Update existing movie records in JSON Server
  - **Delete Movie**: Permanent removal with modal confirmation
- **Genre Management**:
  - View all genres (`/admin/genres`)
  - Add new genre categories
  - Inline edit existing genre names
  - Delete genres with confirmation
- **Review Moderation**:
  - View all submitted audience critiques
  - Identifies the movie associated with each review
  - Delete inappropriate or unwanted reviews

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7 |
| **Backend & Database** | JSON Server (`db.json`) + Node.js (`server.js`) |
| **External Movie Metadata** | The Movie Database (TMDB) API v3 |
| **Styling** | Vanilla CSS (Dark cinematic theme, glassmorphism, responsive CSS grid/flexbox) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
moive_project2/
├── db.json                     # JSON Server Database (Movies, Genres, Reviews)
├── server.js                   # Node.js backend server with CORS & 0.0.0.0 binding
├── .env                        # Local environment variables
├── .env.example                # Environment variables template
├── netlify.toml                # Netlify SPA routing configuration
├── package.json                # Project dependencies and npm scripts
├── public/
│   └── _redirects              # Netlify SPA redirect rules
├── scripts/
│   └── seedGenerator.js        # Seed script for curated genuine TMDB movies
└── src/
    ├── main.jsx                # Application root entry
    ├── App.jsx                 # Route definitions & portal separation
    ├── App.css
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx          # User Portal navigation with Admin link
    │   ├── HeroBanner.jsx      # Cinematic hero carousel
    │   ├── MovieCard.jsx       # Reusable responsive movie card
    │   ├── MovieRow.jsx        # Horizontal streaming shelf
    │   ├── SearchFilters.jsx   # Search & multi-filter toolbar
    │   ├── ReviewForm.jsx      # 5-star review submission form
    │   ├── ReviewList.jsx      # Community critiques display
    │   ├── TrailerModal.jsx    # YouTube trailer embed modal
    │   ├── ConfirmModal.jsx    # Action confirmation dialog
    │   ├── NotificationToast.jsx
    │   ├── Loading.jsx
    │   └── ErrorMessage.jsx
    ├── pages/
    │   ├── Home.jsx            # User Portal homepage
    │   ├── CategoryPage.jsx    # Industry category page (Tollywood, Bollywood, etc.)
    │   ├── SearchPage.jsx      # Search & filter catalog
    │   ├── MovieDetails.jsx    # Movie details with dual ratings & reviews
    │   ├── NotFound.jsx        # 404 page
    │   └── admin/
    │       ├── AdminLayout.jsx # Clean admin layout with 5 required links
    │       ├── AdminMovies.jsx # Movie table with search & delete
    │       ├── AdminMovieForm.jsx # Add/Edit movie with TMDB auto-fill
    │       ├── AdminGenres.jsx # Genre management
    │       ├── AdminReviews.jsx# Review moderation
    │       └── Admin.css       # Admin portal styling
    ├── services/
    │   ├── api.js              # Centralized JSON Server API service (Movies, Genres, Reviews)
    │   └── tmdb.js             # TMDB API service for posters, trailers, cast credits
    └── styles/
        └── global.css          # Design system & dark cinematic styles
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
VITE_API_URL=http://localhost:3000
VITE_TMDB_API_KEY=3fd2be6f0c70a2a598f084ddfb75487c
VITE_TMDB_BASE_URL=https://api.tmdb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 3. Start the Backend (JSON Server)
In a terminal window:
```bash
npm run server
```
This runs `node server.js` and serves `db.json` at `http://localhost:3000`.

### 4. Start the Frontend Application
In a second terminal window:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎓 React Concepts Demonstrated

This project is tailored for academic evaluation and demonstrates fundamental and intermediate React concepts cleanly:
1. **Functional Components & Props**: Modular component architecture (`MovieCard`, `MovieRow`, `ReviewForm`, `ConfirmModal`).
2. **State Management (`useState`)**: Local state for form inputs, star ratings, modals, active filters, and error handling.
3. **Lifecycle & Side Effects (`useEffect`)**: Data fetching on mount, synchronizing query parameters, and trailer cleanup.
4. **Declarative Routing (`react-router-dom`)**:
   - Dynamic parameters: `/movies/:id` and `/admin/movies/edit/:id`
   - Redirection: `/admin` redirects to `/admin/movies`
   - Portal separation: Admin Portal vs User Portal layouts
5. **Form Validation & Controlled Components**: Custom validation for ratings, reviews, and movie metadata.
6. **Centralized API Service**: Clean `src/services/api.js` abstraction using standard `fetch` API for all CRUD operations.
7. **Dynamic Computations**: Real-time average user rating calculations with fallback states.

---

## 🌐 Deployment Instructions

### Frontend: Netlify (Zero Configuration Needed)
1. Connect your repository to Netlify.
2. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Resilient Data Architecture**:
   - The application is equipped with an automatic client-side storage engine pre-populated with all 24 movies, 48 reviews, and genres.
   - When deployed to Netlify without a separate Node server, **data is retrieved instantly without errors or blank screens**!
   - Full CRUD operations (adding, editing, and deleting movies or reviews) work persistently in the browser.
4. Optional Environment Variables (in Netlify Site Settings > Environment Variables):
   - `VITE_API_URL`: Your deployed backend URL on Render (e.g., `https://cineverse-api.onrender.com`) if you choose to host a live Node server.
   - `VITE_TMDB_API_KEY`: Your TMDB API key.
5. SPA Redirects: Handled automatically by `netlify.toml` and `public/_redirects`.

### Backend: Render (Optional Dedicated Live Node Server)
1. Create a **New Web Service** on Render connected to this repository.
2. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start` (executes `node server.js`)
3. The server automatically binds to host `0.0.0.0` and listens on `process.env.PORT` provided by Render.
4. Copy your Render URL (e.g., `https://cineverse-backend.onrender.com`) and add it as `VITE_API_URL` in your Netlify site settings.

---

## 📜 Attributions
- Movie information, posters, backdrops, and trailer links are sourced via [The Movie Database (TMDB) API](https://developer.themoviedb.org).
- This product uses the TMDB API but is not officially certified or endorsed by TMDB.
