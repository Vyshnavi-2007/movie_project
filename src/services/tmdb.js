/**
 * Premier Entertainer Portal - TMDB API Service Layer
 * Fetches real, dynamic movie metadata, original posters, backdrops,
 * official trailers, and credits from The Movie Database (TMDB).
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.tmdb.org/3';
export const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// Standard fallback placeholder image for movies with missing posters
export const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
export const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80';

// In-memory cache for API requests to minimize network usage and avoid rate limits
const cache = new Map();

/**
 * Perform a cached GET request to TMDB
 */
async function fetchFromTMDB(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    include_adult: 'false',
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  const cacheKey = url;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TMDB API Error [${response.status}]: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Failed to fetch from ${endpoint}:`, err);
    throw err;
  }
}

// ==========================================
// IMAGE HELPERS
// ==========================================

export function getPosterUrl(posterPath, size = 'w500') {
  if (!posterPath) return FALLBACK_POSTER;
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
}

export function getBackdropUrl(backdropPath, size = 'original') {
  if (!backdropPath) return FALLBACK_BACKDROP;
  return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
}

export function getProfileUrl(profilePath, size = 'w185') {
  if (!profilePath) return null;
  return `${IMAGE_BASE_URL}/${size}${profilePath}`;
}

// ==========================================
// FORMATTING UTILITIES
// ==========================================

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function getLanguageName(isoCode) {
  const languages = {
    te: 'Telugu',
    hi: 'Hindi',
    en: 'English',
    ja: 'Japanese',
    ta: 'Tamil',
    ml: 'Malayalam',
    kn: 'Kannada',
    ko: 'Korean',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    zh: 'Chinese',
    it: 'Italian',
  };
  return languages[isoCode] || isoCode?.toUpperCase() || 'Unknown';
}

export function getIndustryBadge(movie) {
  if (!movie) return 'Cinema';
  const lang = movie.original_language;
  const genres = movie.genre_ids || (movie.genres ? movie.genres.map((g) => g.id) : []);

  if (lang === 'te') return 'Tollywood';
  if (lang === 'hi') return 'Bollywood';
  if (lang === 'ja' && genres.includes(16)) return 'Anime';
  if (lang === 'en') return 'Hollywood';
  return getLanguageName(lang);
}

// ==========================================
// GENRES
// ==========================================

let cachedGenres = null;

export async function getGenres() {
  if (cachedGenres) return cachedGenres;
  try {
    const data = await fetchFromTMDB('/genre/movie/list');
    cachedGenres = data.genres || [];
    return cachedGenres;
  } catch {
    return [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' },
      { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' },
      { id: 27, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Sci-Fi' },
      { id: 53, name: 'Thriller' },
      { id: 10752, name: 'War' },
      { id: 37, name: 'Western' },
    ];
  }
}

// ==========================================
// MOVIE LIST ENDPOINTS
// ==========================================

export async function getTrendingMovies(timeWindow = 'week', page = 1) {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`, { page });
}

export async function getNowPlayingMovies(page = 1) {
  return fetchFromTMDB('/movie/now_playing', { page });
}

export async function getUpcomingMovies(page = 1) {
  return fetchFromTMDB('/movie/upcoming', { page });
}

export async function getPopularMovies(page = 1) {
  return fetchFromTMDB('/movie/popular', { page });
}

// ==========================================
// CATEGORY SPECIFIC ENDPOINTS
// ==========================================

/**
 * Tollywood: Latest Telugu movies
 */
export async function getTollywoodMovies({ page = 1, genre, year, sortBy = 'popularity.desc' } = {}) {
  const params = {
    with_original_language: 'te',
    sort_by: sortBy,
    page,
  };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  return fetchFromTMDB('/discover/movie', params);
}

/**
 * Bollywood: Latest Hindi movies
 */
export async function getBollywoodMovies({ page = 1, genre, year, sortBy = 'popularity.desc' } = {}) {
  const params = {
    with_original_language: 'hi',
    sort_by: sortBy,
    page,
  };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  return fetchFromTMDB('/discover/movie', params);
}

/**
 * Hollywood: Latest English movies
 */
export async function getHollywoodMovies({ page = 1, genre, year, sortBy = 'popularity.desc' } = {}) {
  const params = {
    with_original_language: 'en',
    sort_by: sortBy,
    page,
  };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  return fetchFromTMDB('/discover/movie', params);
}

/**
 * Anime: Japanese animated feature films
 */
export async function getAnimeMovies({ page = 1, genre, year, sortBy = 'popularity.desc' } = {}) {
  const params = {
    with_original_language: 'ja',
    with_genres: genre ? `16,${genre}` : '16',
    sort_by: sortBy,
    page,
  };
  if (year) params.primary_release_year = year;
  return fetchFromTMDB('/discover/movie', params);
}

// ==========================================
// SEARCH & DISCOVER
// ==========================================

export async function searchMovies(query, { page = 1, year, primaryReleaseYear } = {}) {
  if (!query || !query.trim()) {
    return { results: [], total_pages: 0, total_results: 0 };
  }
  const params = {
    query: query.trim(),
    page,
  };
  if (year || primaryReleaseYear) params.primary_release_year = year || primaryReleaseYear;
  return fetchFromTMDB('/search/movie', params);
}

export async function discoverMovies({
  language,
  genre,
  year,
  sortBy = 'popularity.desc',
  page = 1,
} = {}) {
  const params = {
    sort_by: sortBy,
    page,
  };
  if (language) params.with_original_language = language;
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  return fetchFromTMDB('/discover/movie', params);
}

// ==========================================
// MOVIE DETAILS
// ==========================================

export async function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,similar',
  });
}

/**
 * Extract the official YouTube trailer key from videos list
 */
export function extractOfficialTrailer(videos) {
  if (!videos || !videos.results || videos.results.length === 0) return null;
  const youtubeVideos = videos.results.filter((v) => v.site === 'YouTube');
  
  // 1. Look for official Trailer
  const officialTrailer = youtubeVideos.find((v) => v.type === 'Trailer' && v.official);
  if (officialTrailer) return officialTrailer;

  // 2. Look for any Trailer
  const anyTrailer = youtubeVideos.find((v) => v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  // 3. Fallback to Teaser
  const teaser = youtubeVideos.find((v) => v.type === 'Teaser');
  if (teaser) return teaser;

  // 4. Return any video
  return youtubeVideos[0] || null;
}
