// scripts/seedGenerator.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';

const GENRES = [
  { id: '1', name: 'Action' },
  { id: '2', name: 'Adventure' },
  { id: '3', name: 'Animation' },
  { id: '4', name: 'Comedy' },
  { id: '5', name: 'Crime' },
  { id: '6', name: 'Drama' },
  { id: '7', name: 'Fantasy' },
  { id: '8', name: 'Horror' },
  { id: '9', name: 'Romance' },
  { id: '10', name: 'Science Fiction' },
  { id: '11', name: 'Thriller' }
];

const MOVIES_CONFIG = [
  // Tollywood (Telugu)
  { query: 'Kalki 2898 AD', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '10', isTrending: true, isPopular: true },
  { query: 'RRR', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isTrending: true, isPopular: true },
  { query: 'Baahubali 2: The Conclusion', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isPopular: true },
  { query: 'Baahubali: The Beginning', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isPopular: true },
  { query: 'Salaar', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isTrending: true },
  { query: 'Pushpa: The Rise', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isPopular: true },
  { query: 'Pushpa 2', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isUpcoming: true, isTrending: true },
  { query: 'Devara Part 1', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '1', isTrending: true },
  { query: 'Hanu-Man', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '7', isPopular: true },
  { query: 'Sita Ramam', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '9', isPopular: true },
  { query: 'Eega', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '7' },
  { query: 'Jersey 2019', industry: 'Tollywood', language: 'Telugu', defaultGenreId: '6' },

  // Bollywood (Hindi)
  { query: 'Jawan', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '1', isTrending: true, isPopular: true },
  { query: 'Pathaan', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '1', isPopular: true },
  { query: '12th Fail', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '6', isTrending: true, isPopular: true },
  { query: 'Dangal', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '6', isPopular: true },
  { query: '3 Idiots', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '4', isPopular: true },
  { query: 'Stree 2', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '4', isTrending: true, isPopular: true },
  { tmdbId: 781732, industry: 'Bollywood', language: 'Hindi', defaultGenreId: '1', isPopular: true },
  { query: 'Brahmastra', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '7' },
  { query: 'Sholay', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '1' },
  { query: 'Dilwale Dulhania Le Jayenge', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '9', isPopular: true },
  { query: 'Andhadhun', industry: 'Bollywood', language: 'Hindi', defaultGenreId: '11', isPopular: true },
  { tmdbId: 297222, industry: 'Bollywood', language: 'Hindi', defaultGenreId: '4' },

  // Hollywood (English)
  { query: 'Interstellar', industry: 'Hollywood', language: 'English', defaultGenreId: '10', isTrending: true, isPopular: true },
  { query: 'Inception', industry: 'Hollywood', language: 'English', defaultGenreId: '10', isPopular: true },
  { query: 'The Dark Knight', industry: 'Hollywood', language: 'English', defaultGenreId: '1', isPopular: true },
  { query: 'Oppenheimer', industry: 'Hollywood', language: 'English', defaultGenreId: '6', isTrending: true, isPopular: true },
  { query: 'Dune: Part Two', industry: 'Hollywood', language: 'English', defaultGenreId: '10', isTrending: true, isPopular: true },
  { query: 'Avengers: Endgame', industry: 'Hollywood', language: 'English', defaultGenreId: '1', isPopular: true },
  { query: 'Spider-Man: Across the Spider-Verse', industry: 'Hollywood', language: 'English', defaultGenreId: '3', isPopular: true },
  { query: 'Gladiator II', industry: 'Hollywood', language: 'English', defaultGenreId: '1', isUpcoming: true, isTrending: true },
  { query: 'The Matrix', industry: 'Hollywood', language: 'English', defaultGenreId: '10', isPopular: true },
  { query: 'Pulp Fiction', industry: 'Hollywood', language: 'English', defaultGenreId: '5' },
  { query: 'The Shawshank Redemption', industry: 'Hollywood', language: 'English', defaultGenreId: '6', isPopular: true },
  { query: 'Top Gun: Maverick', industry: 'Hollywood', language: 'English', defaultGenreId: '1', isPopular: true },

  // Anime (Japanese)
  { query: 'Spirited Away', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isPopular: true },
  { query: 'Your Name', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isTrending: true, isPopular: true },
  { query: 'Demon Slayer the Movie: Mugen Train', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isPopular: true },
  { query: 'Suzume', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isTrending: true, isPopular: true },
  { query: 'Princess Mononoke', industry: 'Anime', language: 'Japanese', defaultGenreId: '3' },
  { query: 'A Silent Voice', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isPopular: true },
  { query: 'Howl\'s Moving Castle', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isPopular: true },
  { query: 'The Boy and the Heron', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isTrending: true },
  { query: 'Jujutsu Kaisen 0', industry: 'Anime', language: 'Japanese', defaultGenreId: '3', isPopular: true },
  { query: 'Weathering with You', industry: 'Anime', language: 'Japanese', defaultGenreId: '3' },
  { query: 'Grave of the Fireflies', industry: 'Anime', language: 'Japanese', defaultGenreId: '3' },
  { query: 'My Neighbor Totoro', industry: 'Anime', language: 'Japanese', defaultGenreId: '3' }
];

async function fetchMovieData(config) {
  try {
    let movieId = config.tmdbId;
    if (!movieId) {
      const url = `https://api.tmdb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(config.query)}&include_adult=false`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        console.warn('No result for:', config.query);
        return null;
      }
      movieId = data.results[0].id;
    }

    // Fetch full details for runtime
    const detailRes = await fetch(`https://api.tmdb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const details = await detailRes.json();

    const genreNames = details.genres ? details.genres.map(g => g.name).join(', ') : 'Action';

    return {
      tmdbId: details.id,
      title: details.title,
      overview: details.overview,
      poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      backdrop: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
      releaseDate: details.release_date || '2024-01-01',
      genre: genreNames,
      genreId: config.defaultGenreId,
      language: config.language,
      industry: config.industry,
      runtime: details.runtime || 120,
      rating: Math.round((details.vote_average || 7.5) * 10) / 10,
      isTrending: Boolean(config.isTrending),
      isPopular: Boolean(config.isPopular),
      isUpcoming: Boolean(config.isUpcoming)
    };
  } catch (err) {
    console.error('Error fetching', config.query || config.tmdbId, err);
    return null;
  }
}

async function run() {
  console.log('Fetching curated genuine movies from TMDB...');
  const movies = [];
  let idCounter = 1;

  for (const config of MOVIES_CONFIG) {
    console.log(`Fetching [${config.industry}] ${config.query}...`);
    const movieData = await fetchMovieData(config);
    if (movieData) {
      movies.push({
        id: String(idCounter++),
        ...movieData
      });
    }
    // Small pause to be gentle on TMDB rate limit
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`Successfully fetched ${movies.length} movies!`);

  const initialReviews = [
    {
      id: "1",
      movieId: "1",
      username: "Vikramaditya",
      rating: 5,
      comment: "Spectacular world-building and mytho-sci-fi visuals. Amitabh Bachchan as Ashwatthama stole every single scene!",
      createdAt: "2026-10-15"
    },
    {
      id: "2",
      movieId: "1",
      username: "Pooja Hegde Fan",
      rating: 4,
      comment: "Mind-bending visual effects and high-concept dystopian future. Prabhas looked energetic in the climax.",
      createdAt: "2026-10-18"
    },
    {
      id: "3",
      movieId: "2",
      username: "Sita Ram",
      rating: 5,
      comment: "SS Rajamouli at his finest. Ram Charan and Jr NTR delivered career-defining performances. Naatu Naatu sequence was pure electricity!",
      createdAt: "2026-10-12"
    },
    {
      id: "4",
      movieId: "3",
      username: "Karthik Verma",
      rating: 5,
      comment: "The greatest Indian cinematic sequel ever made. Katappa's answer and the coronation sequence give goosebumps.",
      createdAt: "2026-10-10"
    },
    {
      id: "5",
      movieId: "13",
      username: "Rahul Khanna",
      rating: 5,
      comment: "SRK mass avatar at an all-time high! Atlee directed a solid commercial action film with great social message.",
      createdAt: "2026-10-20"
    },
    {
      id: "6",
      movieId: "15",
      username: "Neha Sharma",
      rating: 5,
      comment: "One of the most inspiring and honest movies made in India. Vikrant Massey deserved all the national awards for this performance.",
      createdAt: "2026-10-22"
    },
    {
      id: "7",
      movieId: "25",
      username: "Dr. Brand",
      rating: 5,
      comment: "Timeless sci-fi masterpiece. Hans Zimmer's pipe organ score and Nolan's emotional depiction of time dilation are breathtaking.",
      createdAt: "2026-10-19"
    },
    {
      id: "8",
      movieId: "27",
      username: "Bruce Wayne",
      rating: 5,
      comment: "Heath Ledger's Joker is legendary. The pinnacle of superhero and crime drama cinema.",
      createdAt: "2026-10-14"
    },
    {
      id: "9",
      movieId: "37",
      username: "Chihiro Fan",
      rating: 5,
      comment: "Hayao Miyazaki's magnum opus. The bathhouse spirit world feels alive, poetic, and utterly magical.",
      createdAt: "2026-10-21"
    },
    {
      id: "10",
      movieId: "38",
      username: "Taki Tachibana",
      rating: 5,
      comment: "Makoto Shinkai's animation and Radwimps music made this an unforgettable emotional journey.",
      createdAt: "2026-10-24"
    }
  ];

  const dbData = {
    movies,
    genres: GENRES,
    reviews: initialReviews
  };

  const dbPath = path.join(__dirname, '..', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log(`Saved curated db.json successfully to ${dbPath}`);
}

run().catch(console.error);
