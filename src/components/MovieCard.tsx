'use client';

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./MovieCard.module.css";
import { useState, useEffect } from "react";

export function MovieCard({ movie }: { movie: Movie }) {
  const [runtime, setRuntime] = useState<number | null>(null);

  useEffect(() => {
    // Fetch movie details to get runtime
    const fetchRuntime = async () => {
      try {
        const details = await tmdbService.getMovieDetails(movie.id);
        setRuntime(details.runtime);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    
    fetchRuntime();
  }, [movie.id]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}m`;
  };

  return (
    <Link href={`/film/${movie.id}`} className={styles.card}>
      <div>
        <div className={styles.posterContainer}>
          {movie.poster_path ? (
            <Image
              src={tmdbService.getImageUrl(movie.poster_path, 'w342')}
              alt={movie.title}
              width={160}
              height={240}
              className={styles.poster}
              sizes="160px"
            />
          ) : (
            <div className={styles.noImage}>
              <span>No image</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{movie.title}</h3>
          {runtime && (
            <div className={styles.duration}>
              {formatDuration(runtime)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}