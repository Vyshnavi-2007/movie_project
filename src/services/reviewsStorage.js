/**
 * Community Reviews Storage Service
 * Manages audience ratings and critique submissions for TMDB movies
 * with persistent browser storage and initial sample seeds.
 */

const STORAGE_KEY = 'pep_movie_reviews';

const INITIAL_REVIEWS = [
  {
    id: 'seed-1',
    movieId: '801688', // Kalki 2898-AD
    userName: 'Vikramaditya',
    rating: 5,
    comment: 'Spectacular world-building and mytho-sci-fi visuals. Amitabh Bachchan as Ashwatthama stole every single scene!',
    createdAt: '2026-10-15',
  },
  {
    id: 'seed-2',
    movieId: '256040', // Bāhubali: The Beginning
    userName: 'Aditi Rao',
    rating: 5,
    comment: 'A watershed moment for Indian cinema. Rajamouli’s vision and Prabhas’s screen presence remain unparalleled.',
    createdAt: '2026-10-18',
  },
  {
    id: 'seed-3',
    movieId: '635302', // Demon Slayer Mugen Train
    userName: 'Kenji Takahashi',
    rating: 5,
    comment: 'Ufotable animated this to absolute perfection. Rengoku’s final battle will stay with me forever.',
    createdAt: '2026-10-22',
  },
  {
    id: 'seed-4',
    movieId: '157336', // Interstellar
    userName: 'Dr. Brand',
    rating: 5,
    comment: 'Timeless masterpiece. The emotional resonance between Cooper and Murph across space-time is breathtaking.',
    createdAt: '2026-10-24',
  },
];

function getStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveStoredReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews to localStorage:', err);
  }
}

export async function getReviewsByMovieId(movieId) {
  const reviews = getStoredReviews();
  return reviews.filter((r) => String(r.movieId) === String(movieId));
}

export async function addReview(reviewData) {
  const reviews = getStoredReviews();
  const newReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    movieId: String(reviewData.movieId),
    userName: reviewData.userName.trim(),
    rating: Number(reviewData.rating),
    comment: reviewData.comment.trim(),
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updated = [newReview, ...reviews];
  saveStoredReviews(updated);
  return newReview;
}

export async function updateReview(reviewId, updateData) {
  const reviews = getStoredReviews();
  const index = reviews.findIndex((r) => r.id === reviewId);
  if (index === -1) throw new Error('Review not found');

  reviews[index] = {
    ...reviews[index],
    ...updateData,
    userName: updateData.userName.trim(),
    rating: Number(updateData.rating),
    comment: updateData.comment.trim(),
    updatedAt: new Date().toISOString().split('T')[0],
  };

  saveStoredReviews(reviews);
  return reviews[index];
}

export async function deleteReview(reviewId) {
  const reviews = getStoredReviews();
  const filtered = reviews.filter((r) => r.id !== reviewId);
  saveStoredReviews(filtered);
  return true;
}

export function calculateLocalRating(reviews) {
  if (!reviews || reviews.length === 0) return { average: null, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  const avg = sum / reviews.length;
  return {
    average: Math.round(avg * 10) / 10,
    count: reviews.length,
  };
}
