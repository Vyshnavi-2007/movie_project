/**
 * CineVerse - Centralized Resilient API Service Layer
 * Supports live JSON Server backend (local dev or Render)
 * with automatic fallback to persistent client-side storage when deployed.
 */

import { initialData } from '../data/initialData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const STORAGE_KEYS = {
  movies: 'cineverse_movies_db',
  genres: 'cineverse_genres_db',
  reviews: 'cineverse_reviews_db',
};

// ==========================================
// CLIENT STORAGE FALLBACK ENGINE (For Deployed Environment)
// ==========================================

function getLocalData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`[CineVerse API] Storage read failed for "${key}":`, err);
  }

  // Populate initial dataset from initialData.js
  try {
    localStorage.setItem(key, JSON.stringify(fallback));
  } catch {}
  return fallback;
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[CineVerse API] Storage write failed for "${key}":`, err);
  }
}

/**
  * Resilient fetch with short timeout to prevent blocking when deployed without a Node backend
  */
async function resilientFetch(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function handleResponse(response, defaultErrorMessage = 'API request failed') {
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(`${defaultErrorMessage} (${response.status}: ${errorDetail || 'Server error'})`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
  return {};
}

// ==========================================
// 1. MOVIES CRUD OPERATIONS
// ==========================================

export async function getMovies() {
  try {
    const res = await resilientFetch(`${BASE_URL}/movies`);
    const data = await handleResponse(res, 'Failed to fetch movies');
    if (Array.isArray(data) && data.length > 0) {
      setLocalData(STORAGE_KEYS.movies, data);
      return data;
    }
  } catch (err) {
    console.info('[CineVerse] Backend unavailable or deployed in static mode. Serving movies from persistent storage.');
  }

  // Fallback to local storage (initialized with all 24 genuine movies)
  return getLocalData(STORAGE_KEYS.movies, initialData.movies);
}

export async function getMovieById(id) {
  const targetId = String(id);
  try {
    const res = await resilientFetch(`${BASE_URL}/movies/${targetId}`);
    const data = await handleResponse(res, `Failed to fetch movie #${targetId}`);
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    // Fallback
  }

  const movies = getLocalData(STORAGE_KEYS.movies, initialData.movies);
  const found = movies.find((m) => String(m.id) === targetId || String(m.tmdbId) === targetId);
  if (!found) {
    throw new Error(`Movie with ID "${id}" was not found.`);
  }
  return found;
}

export async function createMovie(movieData) {
  const payload = {
    ...movieData,
    id: String(Date.now()),
    runtime: Number(movieData.runtime) || 120,
    rating: Number(movieData.rating) || 5.0,
    genreId: String(movieData.genreId || '1'),
    industry: movieData.industry || 'Tollywood',
    language: movieData.language || 'Telugu',
    trailerKey: movieData.trailerKey || '',
    isTrending: Boolean(movieData.isTrending),
    isPopular: Boolean(movieData.isPopular),
    isUpcoming: Boolean(movieData.isUpcoming),
  };

  // Update persistent local storage first
  const current = getLocalData(STORAGE_KEYS.movies, initialData.movies);
  setLocalData(STORAGE_KEYS.movies, [payload, ...current]);

  // Attempt backend write if online
  try {
    const res = await resilientFetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, 'Failed to add movie');
  } catch (err) {
    console.info('[CineVerse] Saved movie to local database.');
    return payload;
  }
}

export async function updateMovie(id, movieData) {
  const targetId = String(id);
  const payload = {
    ...movieData,
    id: targetId,
    runtime: Number(movieData.runtime) || 120,
    rating: Number(movieData.rating) || 5.0,
    genreId: String(movieData.genreId || '1'),
    industry: movieData.industry || 'Tollywood',
    language: movieData.language || 'Telugu',
    trailerKey: movieData.trailerKey || '',
    isTrending: Boolean(movieData.isTrending),
    isPopular: Boolean(movieData.isPopular),
    isUpcoming: Boolean(movieData.isUpcoming),
  };

  // Update local storage
  const current = getLocalData(STORAGE_KEYS.movies, initialData.movies);
  const updated = current.map((m) => (String(m.id) === targetId ? payload : m));
  setLocalData(STORAGE_KEYS.movies, updated);

  try {
    const res = await resilientFetch(`${BASE_URL}/movies/${targetId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, `Failed to update movie #${targetId}`);
  } catch (err) {
    console.info('[CineVerse] Updated movie in local database.');
    return payload;
  }
}

export async function deleteMovie(id) {
  const targetId = String(id);

  // Update local storage immediately so UI is responsive
  const current = getLocalData(STORAGE_KEYS.movies, initialData.movies);
  const updated = current.filter((m) => String(m.id) !== targetId);
  setLocalData(STORAGE_KEYS.movies, updated);

  // Also remove reviews associated with this movie
  const reviews = getLocalData(STORAGE_KEYS.reviews, initialData.reviews);
  const filteredReviews = reviews.filter((r) => String(r.movieId) !== targetId);
  setLocalData(STORAGE_KEYS.reviews, filteredReviews);

  try {
    const res = await resilientFetch(`${BASE_URL}/movies/${targetId}`, {
      method: 'DELETE',
    });
    return await handleResponse(res, `Failed to delete movie #${targetId}`);
  } catch (err) {
    console.info(`[CineVerse] Removed movie #${targetId} from local database.`);
    return { success: true, id: targetId };
  }
}

// ==========================================
// 2. GENRES CRUD OPERATIONS
// ==========================================

export async function getGenres() {
  try {
    const res = await resilientFetch(`${BASE_URL}/genres`);
    const data = await handleResponse(res, 'Failed to fetch genres');
    if (Array.isArray(data) && data.length > 0) {
      setLocalData(STORAGE_KEYS.genres, data);
      return data;
    }
  } catch (err) {
    // Fallback
  }

  return getLocalData(STORAGE_KEYS.genres, initialData.genres);
}

export async function createGenre(genreData) {
  const payload = {
    id: String(Date.now()),
    name: genreData.name.trim(),
  };

  const current = getLocalData(STORAGE_KEYS.genres, initialData.genres);
  setLocalData(STORAGE_KEYS.genres, [...current, payload]);

  try {
    const res = await resilientFetch(`${BASE_URL}/genres`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, 'Failed to create genre');
  } catch (err) {
    return payload;
  }
}

export async function updateGenre(id, genreData) {
  const targetId = String(id);
  const payload = {
    id: targetId,
    name: genreData.name.trim(),
  };

  const current = getLocalData(STORAGE_KEYS.genres, initialData.genres);
  const updated = current.map((g) => (String(g.id) === targetId ? payload : g));
  setLocalData(STORAGE_KEYS.genres, updated);

  try {
    const res = await resilientFetch(`${BASE_URL}/genres/${targetId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, `Failed to update genre #${targetId}`);
  } catch (err) {
    return payload;
  }
}

export async function deleteGenre(id) {
  const targetId = String(id);
  const current = getLocalData(STORAGE_KEYS.genres, initialData.genres);
  const updated = current.filter((g) => String(g.id) !== targetId);
  setLocalData(STORAGE_KEYS.genres, updated);

  try {
    const res = await resilientFetch(`${BASE_URL}/genres/${targetId}`, {
      method: 'DELETE',
    });
    return await handleResponse(res, `Failed to delete genre #${targetId}`);
  } catch (err) {
    return { success: true, id: targetId };
  }
}

// ==========================================
// 3. REVIEWS CRUD OPERATIONS
// ==========================================

export async function getReviews(movieId = null) {
  try {
    const url = movieId !== null
      ? `${BASE_URL}/reviews?movieId=${encodeURIComponent(movieId)}`
      : `${BASE_URL}/reviews`;
    const res = await resilientFetch(url);
    const data = await handleResponse(res, 'Failed to fetch reviews');
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    // Fallback
  }

  const allReviews = getLocalData(STORAGE_KEYS.reviews, initialData.reviews);
  if (movieId !== null) {
    return allReviews.filter((r) => String(r.movieId) === String(movieId));
  }
  return allReviews;
}

export async function createReview(reviewData) {
  const payload = {
    id: String(Date.now()),
    movieId: String(reviewData.movieId),
    username: (reviewData.username || reviewData.userName || 'Cinephile').trim(),
    userName: (reviewData.username || reviewData.userName || 'Cinephile').trim(),
    rating: Number(reviewData.rating) || 5,
    comment: (reviewData.comment || '').trim(),
    createdAt: reviewData.createdAt || new Date().toISOString().split('T')[0],
  };

  const current = getLocalData(STORAGE_KEYS.reviews, initialData.reviews);
  setLocalData(STORAGE_KEYS.reviews, [payload, ...current]);

  try {
    const res = await resilientFetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, 'Failed to submit review');
  } catch (err) {
    console.info('[CineVerse] Saved audience review locally.');
    return payload;
  }
}

export async function updateReview(id, reviewData) {
  const targetId = String(id);
  const payload = {
    ...reviewData,
    id: targetId,
    movieId: String(reviewData.movieId),
    username: (reviewData.username || reviewData.userName || '').trim(),
    rating: Number(reviewData.rating),
    comment: (reviewData.comment || '').trim(),
  };

  const current = getLocalData(STORAGE_KEYS.reviews, initialData.reviews);
  const updated = current.map((r) => (String(r.id) === targetId ? payload : r));
  setLocalData(STORAGE_KEYS.reviews, updated);

  try {
    const res = await resilientFetch(`${BASE_URL}/reviews/${targetId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    });
    return await handleResponse(res, `Failed to update review #${targetId}`);
  } catch (err) {
    return payload;
  }
}

export async function deleteReview(id) {
  const targetId = String(id);
  const current = getLocalData(STORAGE_KEYS.reviews, initialData.reviews);
  const updated = current.filter((r) => String(r.id) !== targetId);
  setLocalData(STORAGE_KEYS.reviews, updated);

  try {
    const res = await resilientFetch(`${BASE_URL}/reviews/${targetId}`, {
      method: 'DELETE',
    });
    return await handleResponse(res, `Failed to delete review #${targetId}`);
  } catch (err) {
    console.info(`[CineVerse] Removed review #${targetId} locally.`);
    return { success: true, id: targetId };
  }
}

// ==========================================
// 4. HELPER: AUDIENCE RATING CALCULATION
// ==========================================

export function calculateAverageRating(reviewsList) {
  if (!reviewsList || reviewsList.length === 0) {
    return { average: null, count: 0 };
  }
  const sum = reviewsList.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  const avg = sum / reviewsList.length;
  return {
    average: Math.round(avg * 10) / 10,
    count: reviewsList.length,
  };
}
