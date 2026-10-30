/**
 * Rating and Statistics Utilities for CineVerse
 */

/**
 * Calculates average rating and count for a specific movie from a list of reviews
 * @param {Array} reviews - Array of review objects
 * @param {string|number} movieId - The movie ID to filter by (or already filtered reviews)
 * @returns {Object} { average: number|null, count: number, formatted: string }
 */
export function getMovieRatingStats(reviews = [], movieId = null) {
  const movieReviews = movieId !== null
    ? reviews.filter((r) => String(r.movieId) === String(movieId))
    : reviews;

  const count = movieReviews.length;
  if (count === 0) {
    return {
      average: null,
      count: 0,
      formatted: 'No reviews yet',
      numeric: 0,
    };
  }

  const sum = movieReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avg = Math.round((sum / count) * 10) / 10;

  return {
    average: avg,
    count,
    formatted: `${avg.toFixed(1)} / 5`,
    numeric: avg,
  };
}

/**
 * Calculates dashboard-wide statistics
 * @param {Array} movies
 * @param {Array} genres
 * @param {Array} reviews
 * @returns {Object} statistics
 */
export function calculateDashboardStats(movies = [], genres = [], reviews = []) {
  const totalMovies = movies.length;
  const totalReviews = reviews.length;

  // 1. Average Rating Across All Movies
  let averageRatingAcrossMovies = null;
  if (reviews.length > 0) {
    const totalReviewScore = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    averageRatingAcrossMovies = Math.round((totalReviewScore / reviews.length) * 10) / 10;
  }

  // 2. Highest-Rated Movie
  // Compute rating for each movie
  const movieRatings = movies.map((movie) => {
    const stats = getMovieRatingStats(reviews, movie.id);
    return {
      movie,
      average: stats.average,
      count: stats.count,
    };
  });

  // Filter movies with at least one review
  const ratedMovies = movieRatings.filter((m) => m.average !== null);

  let highestRated = null;
  let highestRatedTies = [];

  if (ratedMovies.length > 0) {
    // Sort primarily by highest average, then by review count
    ratedMovies.sort((a, b) => {
      if (b.average !== a.average) {
        return b.average - a.average;
      }
      return b.count - a.count;
    });

    const topScore = ratedMovies[0].average;
    highestRatedTies = ratedMovies.filter((m) => m.average === topScore);
    highestRated = ratedMovies[0];
  }

  // 3. Movies by Genre
  const genreMap = {};
  genres.forEach((g) => {
    genreMap[String(g.id)] = {
      id: g.id,
      name: g.name,
      count: 0,
    };
  });

  movies.forEach((m) => {
    const gId = String(m.genreId);
    if (genreMap[gId]) {
      genreMap[gId].count += 1;
    } else {
      // Uncategorized or deleted genre
      const key = 'other';
      if (!genreMap[key]) {
        genreMap[key] = { id: 'other', name: 'Other / Uncategorized', count: 0 };
      }
      genreMap[key].count += 1;
    }
  });

  const moviesByGenre = Object.values(genreMap);

  return {
    totalMovies,
    totalReviews,
    averageRatingAcrossMovies,
    highestRated,
    highestRatedTies,
    moviesByGenre,
  };
}
