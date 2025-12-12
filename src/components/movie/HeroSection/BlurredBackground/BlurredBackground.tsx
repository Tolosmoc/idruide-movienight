"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./BlurredBackground.module.css";

interface BlurredBackgroundProps {
  movies: Movie[];
  currentIndex: number;
}

export function BlurredBackground({ movies, currentIndex }: BlurredBackgroundProps) {
  return (
    <div className={styles.container}>
      <div 
        className={styles.track}
        style={{ transform: `translateY(-${currentIndex * 33.333}%)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className={styles.slide}>
            {movie.backdrop_path && (
              <Image
                src={tmdbService.getBackdropURL(movie.backdrop_path)}
                alt=""
                width={1200}
                height={600}
                className={styles.backdrop}
                loading="eager"
                priority
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.overlay} />
    </div>
  );
}