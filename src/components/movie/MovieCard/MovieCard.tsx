'use client';

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./MovieCard.module.css";
import { useState, useEffect } from "react";

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
}

export function MovieCard({ movie, showRating = false }: MovieCardProps) {
  const [runtime, setRuntime] = useState<number | null>(null);

  useEffect(() => {
    if (!showRating) {
      const fetchRuntime = async () => {
        try {
          const details = await tmdbService.getMovieDetails(movie.id);
          setRuntime(details.runtime);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      };
      
      fetchRuntime();
    }
  }, [movie.id, showRating]);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}m`;
  };

  const formatRating = (rating: number) => {
    return `${Math.round(rating * 10)}%`;
  };

  return (
    <Link href={`/movie/${movie.id}`} className={styles.card}>
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
          
          {showRating ? (
            <div className={styles.ratingContainer}>
              <div className={styles.ratingBar}>
                <div 
                  className={styles.ratingFill} 
                  style={{ width: `${movie.vote_average * 10}%` }}
                />
              </div>
              <span className={styles.ratingText}>{formatRating(movie.vote_average)}</span>
            </div>
          ) : (
            runtime && (
              <div className={styles.duration}>
                {formatDuration(runtime)}
              </div>
            )
          )}
        </div>
      </div>
    </Link>
  );
}