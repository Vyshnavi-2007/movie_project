# 🎬 CineVerse – Movie Discovery & Audience Reviews

**CineVerse** is a React-based movie discovery platform where users can explore movies across different film industries, view movie details, watch trailers and share their experiences through audience ratings and reviews.

🌐 **Live Website:** https://verdant-conkies-179710.netlify.app/

---

## ✨ Features

### 🎥 Movie Discovery
- Explore movies from different film industries.
- Browse Tollywood, Bollywood, Hollywood and Anime categories.
- View movie posters and backdrops.
- Explore movie descriptions and details.
- Watch available movie trailers.

### 🔍 Search and Filtering
- Search movies by title.
- Filter movies by genre, language and release year.
- Sort movies based on available information.

### ⭐ Audience Ratings and Reviews
- Independent 5-star rating system.
- Submit ratings from 1 to 5 stars.
- Write and view audience reviews.
- Display average ratings based on audience feedback.
- View reviewer names, ratings and comments.

### 🛠️ Admin Portal
- Add, view, edit and delete movies.
- Manage movie genres.
- View and delete audience reviews.

---

## 💻 Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application functionality |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JSON Server | Backend and REST API |
| TMDB API | Movie information, posters and trailers |
| React Router | Page navigation |
| Netlify | Frontend deployment |

---

## 📁 Project Structure

```text
CineVerse/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── db.json
├── package.json
├── .env
├── .gitignore
└── README.md
```

*The structure above is a reference. Update it if your actual project uses different folders or filenames.*

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd CineVerse
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY
```

Replace the TMDB key placeholder with your own API key if your application uses it.

Do not commit private API credentials to GitHub.

### 5. Start JSON Server

```bash
npm run server
```

JSON Server will run at:

```text
http://localhost:3000
```

### 6. Start the React Application

Open another terminal and run:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

---

## 🗄️ Database Structure

CineVerse uses JSON Server with three main collections:

```json
{
  "movies": [],
  "genres": [],
  "reviews": []
}
```

### API Endpoints

**Movies**
- GET `/movies`
- GET `/movies/:id`
- POST `/movies`
- PUT `/movies/:id`
- DELETE `/movies/:id`

**Genres**
- GET `/genres`
- POST `/genres`
- PUT `/genres/:id`
- DELETE `/genres/:id`

**Reviews**
- GET `/reviews`
- GET `/reviews/:id`
- POST `/reviews`
- PUT `/reviews/:id`
- DELETE `/reviews/:id`

---

## 🚀 Deployment

The frontend is deployed using Netlify.

**Live Application:** https://verdant-conkies-179710.netlify.app/

For a separate JSON Server backend deployment, configure the production API URL using:

```env
VITE_API_URL=https://YOUR_BACKEND_URL
```

Make sure the backend is deployed and accessible before connecting the live frontend.

---

## 🎯 Project Objective

The main objective of CineVerse is to provide a simple and user-friendly platform for discovering movies and sharing audience opinions.

This project demonstrates practical implementation of React concepts, REST API integration, CRUD operations, component-based development and frontend deployment.

---

## 👩‍💻 Developed By

**Vyshnavi Gottipati**

B.Tech – Computer Science and Engineering

SASI Institute of Technology & Engineering

---

⭐ *CineVerse – Discover Movies. Explore Stories. Share Your Reviews.*
