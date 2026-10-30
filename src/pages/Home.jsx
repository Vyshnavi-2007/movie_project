import React, { useState, useEffect, useMemo } from 'react';
import { getMovies, getGenres } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { 
  TrendingUp, 
  Film, 
  Sparkles, 
  Globe, 
  Tv, 
  Compass
} from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPortalData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [moviesList, genresList] = await Promise.all([
        getMovies(),
        getGenres(),
      ]);

      setMovies(Array.isArray(moviesList) ? moviesList : []);
      setGenres(Array.isArray(genresList) ? genresList : []);
    } catch (err) {
      console.error('Failed to load portal content from JSON Server:', err);
      setError(err.message || 'Unable to connect to the JSON Server database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const genreMap = useMemo(() => {
    const map = {};
    genres.forEach((g) => {
      map[g.id] = g.name;
    });
    return map;
  }, [genres]);

  // Curated category partitions from JSON Server
  const trendingMovies = useMemo(() => {
    const list = movies.filter((m) => m.isTrending);
    return list.length > 0 ? list : movies.slice(0, 6);
  }, [movies]);

  const tollywoodMovies = useMemo(() => {
    return movies.filter((m) => m.industry === 'Tollywood');
  }, [movies]);

  const bollywoodMovies = useMemo(() => {
    return movies.filter((m) => m.industry === 'Bollywood');
  }, [movies]);

  const hollywoodMovies = useMemo(() => {
    return movies.filter((m) => m.industry === 'Hollywood');
  }, [movies]);

  const animeMovies = useMemo(() => {
    return movies.filter((m) => m.industry === 'Anime');
  }, [movies]);

  if (isLoading) {
    return <Loading message="Loading CineVerse movies from database..." showSkeletons count={10} />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <ErrorMessage message={error} onRetry={loadPortalData} />
      </div>
    );
  }

  return (
    <div className="home-page-container">
      {/* Cinematic Hero Banner featuring trending film with Audience Rating */}
      <HeroBanner movies={trendingMovies} />

      <div className="container home-rows-container">
        {/* Tollywood (Telugu Cinema) Dedicated Shelf */}
        <MovieRow
          title="Tollywood – Telugu Cinema"
          icon={Sparkles}
          subtitle="Acclaimed Telugu blockbusters, emotional dramas, and mythological epics"
          movies={tollywoodMovies}
          viewAllLink="/tollywood"
          genreMap={genreMap}
        />

        {/* Bollywood (Hindi Cinema) Dedicated Shelf */}
        <MovieRow
          title="Bollywood – Hindi Cinema"
          icon={Tv}
          subtitle="Top Hindi feature films, gripping dramas, social comedies, and musical hits"
          movies={bollywoodMovies}
          viewAllLink="/bollywood"
          genreMap={genreMap}
        />

        {/* Hollywood (English Cinema) Dedicated Shelf */}
        <MovieRow
          title="Hollywood – English Cinema"
          icon={Globe}
          subtitle="Award-winning global masterpieces, mind-bending sci-fi, and box office sensations"
          movies={hollywoodMovies}
          viewAllLink="/hollywood"
          genreMap={genreMap}
        />

        {/* Anime (Japanese Animation) Dedicated Shelf */}
        <MovieRow
          title="Anime – Japanese Animation"
          icon={Compass}
          subtitle="Celebrated anime feature films, Studio Ghibli classics, and fantasy sagas"
          movies={animeMovies}
          viewAllLink="/anime"
          genreMap={genreMap}
        />

        {/* Trending Spotlight Shelf */}
        <MovieRow
          title="Trending on CineVerse"
          icon={TrendingUp}
          subtitle="Audience favorite picks across all cinema industries"
          movies={trendingMovies}
          viewAllLink="/search?sort=rating.desc"
          genreMap={genreMap}
        />
      </div>
    </div>
  );
}
