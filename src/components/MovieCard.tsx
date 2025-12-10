'use client';

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./MovieCard.module.css";

export function MovieCard({ movie }: { movie: Movie }) {
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

          <div className={styles.metadata}>
            <span className={styles.year}>
              {movie.release_date?.slice(0, 4) || "N/A"}
            </span>
            {movie.vote_average > 0 && (
              <span className={styles.rating}>
                <span className={styles.star}>⭐</span>
                <span>{movie.vote_average.toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}