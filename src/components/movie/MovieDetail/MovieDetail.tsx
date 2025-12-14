'use client';

import { useState, useEffect } from 'react';
import { MovieDetails } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { Header } from '@/components/layout/Header/Header';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { BackdropGlow } from './BackdropGlow/BackdropGlow';
import { MovieHero } from './MovieHero/MovieHero';
import { TrailersSection } from './TrailersSection/TrailersSection';
import { CastSection } from './CastSection/CastSection';
import styles from './MovieDetail.module.css';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieDetailPageProps {
  movieId: number;
}

export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchAndPrepare = async () => {
      try {
        const [movieDetails, creditsData, videosData] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          fetch(
            `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ).then(res => res.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ).then(res => res.json())
        ]);

        const imagesToPreload: string[] = [];
        
        if (movieDetails.backdrop_path) {
          imagesToPreload.push(tmdbService.getBackdropURL(movieDetails.backdrop_path));
        }
        
        if (movieDetails.poster_path) {
          imagesToPreload.push(tmdbService.getImageUrl(movieDetails.poster_path, 'w500'));
        }

        const castPhotos = creditsData.cast
          ?.slice(0, 3)
          .filter((actor: Cast) => actor.profile_path)
          .map((actor: Cast) => tmdbService.getImageUrl(actor.profile_path!, 'w185')) || [];
        imagesToPreload.push(...castPhotos);

        const firstVideo = videosData.results?.filter((v: Video) => v.site === 'YouTube')[0];
        if (firstVideo) {
          imagesToPreload.push(`https://img.youtube.com/vi/${firstVideo.key}/hqdefault.jpg`);
        }

        await Promise.all(
          imagesToPreload.map(src => {
            return new Promise((resolve) => {
              const img = new window.Image();
              img.crossOrigin = 'anonymous';
              img.src = src;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              setTimeout(() => resolve(false), 10000);
            });
          })
        );

        setMovie(movieDetails);
        setCast(creditsData.cast?.slice(0, 11) || []);
        setCrew(creditsData.crew || []);
        setVideos(videosData.results?.filter((v: Video) => v.site === 'YouTube').slice(0, 3) || []);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              setIsReady(true);
            }, 100);
          });
        });
        
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setIsReady(true);
      }
    };

    fetchAndPrepare();
  }, [movieId]);

  if (!isReady || !movie) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <BackdropGlow backdropPath={movie.backdrop_path} />

      <main className={styles.main}>
        <MovieHero movie={movie} crew={crew} />
        <TrailersSection videos={videos} />
        <CastSection cast={cast} />
      </main>
    </div>
  );
}