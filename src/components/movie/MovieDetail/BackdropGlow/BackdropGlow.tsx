'use client';

import { BlurredBackground } from '@/components/movie/HeroSection/BlurredBackground/BlurredBackground';
import { Movie } from '@/types/movie';

interface BackdropGlowProps {
  backdropPath: string | null;
}

export function BackdropGlow({ backdropPath }: BackdropGlowProps) {
  if (!backdropPath) return null;

  const movie: Movie = {
    id: 0,
    backdrop_path: backdropPath,
    adult: false,
    title: '',
    original_language: '',
    original_title: '',
    overview: '',
    poster_path: null,
    genre_ids: [],
    popularity: 0,
    release_date: '',
    video: false,
    vote_average: 0,
    vote_count: 0
  };

  return <BlurredBackground movies={[movie]} currentIndex={0} />;
}