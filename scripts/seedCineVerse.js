// scripts/seedCineVerse.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';

// Exact 24 movies specified by the user across the 4 categories
const MOVIES_SPEC = [
  // ===================== TOLLYWOOD =====================
  {
    tmdbId: 579974,
    title: 'RRR',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Action, Drama',
    trailerKey: 'NgBoMJy386M',
    sampleReviews: [
      { username: 'Rajesh Varma', rating: 5, comment: 'Phenomenal cinematic experience! The visuals, music, and energy were breathtaking.' },
      { username: 'Sneha Reddy', rating: 5, comment: 'NTR and Ram Charan gave their absolute best performances. A proud moment for Indian cinema.' }
    ]
  },
  {
    tmdbId: 857598,
    title: 'Pushpa 2: The Rule',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Action, Crime, Thriller',
    trailerKey: 'g3JUbgOHgdw',
    sampleReviews: [
      { username: 'Kiran Kumar', rating: 5, comment: 'Allu Arjun is unmatched in swagger and screen presence. Highly anticipated sequel!' },
      { username: 'Anusha Rao', rating: 4, comment: 'Electrifying background score by Devi Sri Prasad and high-voltage action sequences.' }
    ]
  },
  {
    tmdbId: 801688,
    title: 'Kalki 2898-AD',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Science Fiction, Action, Fantasy',
    trailerKey: 'rn7tdg6cpW4',
    sampleReviews: [
      { username: 'Vikram Aditya', rating: 5, comment: 'Amitabh Bachchan as Ashwatthama stole the show! Mythological sci-fi at its grandest.' },
      { username: 'Deepika Fan', rating: 4, comment: 'Stunning dystopian world building and world-class VFX quality throughout.' }
    ]
  },
  {
    tmdbId: 811941,
    title: 'Devara: Part 1',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Action, Drama',
    trailerKey: 'S5wQD_0WGTA',
    sampleReviews: [
      { username: 'Chaitanya', rating: 4, comment: 'Jr NTR’s dual role and the coastal sea action sequences were gripping.' },
      { username: 'Pooja Hegde', rating: 4, comment: 'Anirudh’s background score elevates every single mass moment.' }
    ]
  },
  {
    tmdbId: 1068452,
    title: 'Hi Nanna',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Drama, Romance, Family',
    trailerKey: '3Ld05Om2UWs',
    sampleReviews: [
      { username: 'Aditi Sharma', rating: 5, comment: 'Heartfelt, emotional and genuinely tear-jerking. Nani and Mrunal Thakur were phenomenal.' },
      { username: 'Suresh Babu', rating: 5, comment: 'Soulful music by Hesham Abdul Wahab and a beautiful father-daughter relationship.' }
    ]
  },
  {
    tmdbId: 894803,
    title: 'Sita Ramam',
    industry: 'Tollywood',
    language: 'Telugu',
    defaultGenre: 'Romance, Drama, War',
    trailerKey: 'ZYl42EYOCNg',
    sampleReviews: [
      { username: 'Madhavan K', rating: 5, comment: 'A timeless, poetic love story set against the backdrop of 1960s Kashmir. Pure magic.' },
      { username: 'Divya Nair', rating: 5, comment: 'Dulquer Salmaan and Mrunal Thakur shared unforgettable on-screen chemistry.' }
    ]
  },

  // ===================== BOLLYWOOD =====================
  {
    tmdbId: 20453,
    title: '3 Idiots',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Comedy, Drama',
    trailerKey: 'zIKu9k50SDo',
    sampleReviews: [
      { username: 'Aamir Fan', rating: 5, comment: 'The greatest Bollywood comedy-drama of all time. Inspirational message on passion over pressure.' },
      { username: 'Rohan Mehra', rating: 5, comment: 'All Izz Well! Can watch this film a hundred times without getting bored.' }
    ]
  },
  {
    tmdbId: 360814,
    title: 'Dangal',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Drama, Biography, Sport',
    trailerKey: 'x_7YlGv9u1g',
    sampleReviews: [
      { username: 'Geeta Phogat Fan', rating: 5, comment: 'Masterclass in biographical sports cinema. Incredible wrestling choreography.' },
      { username: 'Manish Gupta', rating: 5, comment: 'Emotionally powerful and empowering. Aamir Khan’s transformation was unreal.' }
    ]
  },
  {
    tmdbId: 872906,
    title: 'Jawan',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Action, Thriller',
    trailerKey: 'MWOlnZSnXJo',
    sampleReviews: [
      { username: 'SRKian Forever', rating: 5, comment: 'King Khan delivers an adrenaline-pumping mass spectacle with strong social messages.' },
      { username: 'Tanya Kapoor', rating: 4, comment: 'Atlee’s stylish direction, Anirudh’s thumping beats, and Shah Rukh’s intense avatars.' }
    ]
  },
  {
    tmdbId: 1112426,
    title: 'Stree 2',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Comedy, Horror',
    trailerKey: 'VlvOgk5BHS4',
    sampleReviews: [
      { username: 'Vicky Kaushal Fan', rating: 5, comment: 'Hilarious one-liners from Rajkummar Rao and Pankaj Tripathi. The Sarkata storyline was wild!' },
      { username: 'Priya Joshi', rating: 4, comment: 'Perfect blend of horror and comedy. Thoroughly entertaining from start to finish.' }
    ]
  },
  {
    tmdbId: 1163194,
    title: 'Laapataa Ladies',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Comedy, Drama',
    trailerKey: 'hGM87LCJxRc',
    sampleReviews: [
      { username: 'Kiran Rao Fan', rating: 5, comment: 'Delightfully warm, socially conscious and humorous. Pratibha and Nitanshi were outstanding.' },
      { username: 'Amitabh Sen', rating: 5, comment: 'A breath of fresh air in contemporary Indian cinema. Deserved India’s official Oscar submission.' }
    ]
  },
  {
    tmdbId: 61202,
    title: 'Zindagi Na Milegi Dobara',
    industry: 'Bollywood',
    language: 'Hindi',
    defaultGenre: 'Drama, Adventure, Comedy',
    trailerKey: 'OmJ0ZzMeabg',
    sampleReviews: [
      { username: 'Kabir Khan', rating: 5, comment: 'The ultimate road trip film about facing fears and embracing life. Spain looks magnificent.' },
      { username: 'Rhea Chakraborty', rating: 5, comment: 'Tomatina festival, skydiving, deep-sea diving, and Javed Akhtar’s soulful poetry.' }
    ]
  },

  // ===================== HOLLYWOOD =====================
  {
    tmdbId: 27205,
    title: 'Inception',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Action, Science Fiction, Adventure',
    trailerKey: 'JE9z-gy4De4',
    sampleReviews: [
      { username: 'Christopher Fan', rating: 5, comment: 'Nolan’s mind-bending heist within dreams. Hans Zimmer’s Time still gives chills.' },
      { username: 'Arthur Cobb', rating: 5, comment: 'The spinning totem ending remains one of cinema’s most debated cliffhangers.' }
    ]
  },
  {
    tmdbId: 157336,
    title: 'Interstellar',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Adventure, Drama, Science Fiction',
    trailerKey: 'LY19rHKAaAg',
    sampleReviews: [
      { username: 'Dr. Joseph Cooper', rating: 5, comment: 'Love is the one thing we’re capable of perceiving that transcends dimensions of time and space.' },
      { username: 'Murph Cooper', rating: 5, comment: 'Breathtaking relativity science and an emotional core that never fails to move me to tears.' }
    ]
  },
  {
    tmdbId: 155,
    title: 'The Dark Knight',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Drama, Action, Crime, Thriller',
    trailerKey: '_PZpmTj1Q8Q',
    sampleReviews: [
      { username: 'Gotham Citizen', rating: 5, comment: 'Heath Ledger gave the greatest villain performance in cinematic history.' },
      { username: 'Harvey Dent', rating: 5, comment: 'You either die a hero, or you live long enough to see yourself become the villain.' }
    ]
  },
  {
    tmdbId: 693134,
    title: 'Dune: Part Two',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Science Fiction, Adventure',
    trailerKey: 'U2Qp5pL3ovA',
    sampleReviews: [
      { username: 'Paul Atreides', rating: 5, comment: 'Denis Villeneuve crafted an opera of sand and destiny. Gurney Halleck and worm-riding scenes were insane.' },
      { username: 'Chani Fremen', rating: 5, comment: 'Visually and sonically monumental. Austin Butler as Feyd-Rautha was terrifying.' }
    ]
  },
  {
    tmdbId: 1022789,
    title: 'Inside Out 2',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Animation, Family, Comedy',
    trailerKey: 'LEjhY15eCx0',
    sampleReviews: [
      { username: 'Riley Andersen', rating: 5, comment: 'Anxiety was portrayed with so much empathy and truth. Pixar’s best film in years.' },
      { username: 'Joy & Sadness', rating: 4, comment: 'Wonderful animation and a relatable journey through teenage emotions.' }
    ]
  },
  {
    tmdbId: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    industry: 'Hollywood',
    language: 'English',
    defaultGenre: 'Animation, Action, Adventure, Sci-Fi',
    trailerKey: 'yFrxzaBLDQM',
    sampleReviews: [
      { username: 'Miles Morales', rating: 5, comment: 'Every single frame is a work of museum art. The Mumbattan and Nueva York dimensions were stunning.' },
      { username: 'Gwen Stacy', rating: 5, comment: 'Revolutionary animation styles combined with deeply heartfelt emotional storytelling.' }
    ]
  },

  // ===================== ANIME =====================
  {
    tmdbId: 372058,
    title: 'Your Name.',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Romance, Drama, Fantasy',
    trailerKey: 'TYku4P7MHdo',
    sampleReviews: [
      { username: 'Taki & Mitsuha', rating: 5, comment: 'Makoto Shinkai’s greatest masterpiece. The Radwimps music and twilight comet scene are unforgettable.' },
      { username: 'Anime Connoisseur', rating: 5, comment: 'Emotional, visually gorgeous, and beautifully paced story of red strings of fate.' }
    ]
  },
  {
    tmdbId: 129,
    title: 'Spirited Away',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Family, Fantasy',
    trailerKey: 'GAp2_0JJskk',
    sampleReviews: [
      { username: 'Chihiro Ogino', rating: 5, comment: 'Hayao Miyazaki and Studio Ghibli at the summit of world animation. Pure enchantment.' },
      { username: 'Haku River', rating: 5, comment: 'Rich folklore, stunning hand-drawn art, and an atmospheric bathhouse spirit world.' }
    ]
  },
  {
    tmdbId: 378064,
    title: 'A Silent Voice',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Drama, Romance',
    trailerKey: 'TQK9By9qQiw',
    sampleReviews: [
      { username: 'Shoya Ishida', rating: 5, comment: 'A deeply poignant exploration of redemption, empathy, and forgiveness by Kyoto Animation.' },
      { username: 'Shoko Nishimiya', rating: 5, comment: 'One of the most emotionally resonant and honest animated films ever made.' }
    ]
  },
  {
    tmdbId: 916224,
    title: 'Suzume',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Drama, Fantasy',
    trailerKey: 'g0JMPkn7Wuo',
    sampleReviews: [
      { username: 'Suzume Iwato', rating: 5, comment: 'Closing the doors on past trauma and natural disasters. Visually arresting and spiritually touching.' },
      { username: 'Souta Chair', rating: 4, comment: 'Great balance of humor, road trip vibes, and high-stakes mythological fantasy.' }
    ]
  },
  {
    tmdbId: 635302,
    title: 'Demon Slayer: Mugen Train',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Action, Fantasy',
    trailerKey: 'v30H0qj_b9E',
    sampleReviews: [
      { username: 'Kyojuro Rengoku', rating: 5, comment: 'Set your heart ablaze! Ufotable delivered the greatest battle animation in anime history.' },
      { username: 'Tanjiro Kamado', rating: 5, comment: 'Emotional weight combined with blistering sword choreography and epic orchestral music.' }
    ]
  },
  {
    tmdbId: 508883,
    title: 'The Boy and the Heron',
    industry: 'Anime',
    language: 'Japanese',
    defaultGenre: 'Animation, Adventure, Fantasy',
    trailerKey: 'A002-b7IH2M',
    sampleReviews: [
      { username: 'Mahito Maki', rating: 5, comment: 'Oscar-winning surrealist journey through grief, art, and life. Miyazaki’s personal testament.' },
      { username: 'Grey Heron', rating: 4, comment: 'Mysterious, symbolic, and utterly gorgeous hand-drawn animation.' }
    ]
  }
];

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

async function fetchTMDBData(tmdbId) {
  try {
    const res = await fetch(`https://api.tmdb.org/3/movie/${tmdbId}?api_key=${API_KEY}&append_to_response=credits`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch TMDB #${tmdbId}:`, err.message);
    return null;
  }
}

async function buildDatabase() {
  console.log('Seeding CineVerse with genuine TMDB metadata for all 24 movies...');
  const movies = [];
  const reviews = [];
  let reviewIdCounter = 1;

  for (let i = 0; i < MOVIES_SPEC.length; i++) {
    const spec = MOVIES_SPEC[i];
    const movieId = String(i + 1);

    console.log(`[${spec.industry}] Fetching: ${spec.title} (TMDB ID: ${spec.tmdbId})...`);
    const tmdb = await fetchTMDBData(spec.tmdbId);

    const title = spec.title;
    const overview = tmdb?.overview || `${spec.title} is an acclaimed ${spec.industry} cinematic presentation.`;
    const poster = tmdb?.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` 
      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
    const backdrop = tmdb?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}` 
      : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80';
    const releaseDate = tmdb?.release_date || '2024-01-01';
    const genreNames = tmdb?.genres?.length ? tmdb.genres.map(g => g.name).join(', ') : spec.defaultGenre;
    const runtime = tmdb?.runtime || 135;

    // Build audience reviews for this movie
    const movieReviews = spec.sampleReviews.map(r => ({
      id: String(reviewIdCounter++),
      movieId: movieId,
      username: r.username,
      rating: r.rating,
      comment: r.comment,
      createdAt: '2026-10-25'
    }));

    reviews.push(...movieReviews);

    // Compute audience rating out of 5 from reviews
    const avgRating = Math.round((movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length) * 10) / 10;

    movies.push({
      id: movieId,
      tmdbId: spec.tmdbId,
      title: title,
      overview: overview,
      poster: poster,
      backdrop: backdrop,
      releaseDate: releaseDate,
      genre: genreNames,
      genreId: '1',
      language: spec.language,
      industry: spec.industry,
      runtime: runtime,
      rating: avgRating, // Audience rating out of 5
      trailerKey: spec.trailerKey,
      isTrending: i % 2 === 0,
      isPopular: true,
      isUpcoming: spec.title.includes('Pushpa 2')
    });

    // Slight delay to be gentle on TMDB
    await new Promise(r => setTimeout(r, 100));
  }

  const dbData = {
    movies,
    genres: GENRES,
    reviews
  };

  const dbPath = path.join(__dirname, '..', 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log(`\nSuccessfully created db.json with ${movies.length} movies and ${reviews.length} audience reviews!`);
}

buildDatabase().catch(console.error);
