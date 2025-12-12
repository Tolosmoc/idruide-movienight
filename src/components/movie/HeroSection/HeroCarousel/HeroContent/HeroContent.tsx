"use client";

import { Movie } from "@/types/movie";
import styles from "./HeroContent.module.css";

interface HeroContentProps {
  movie: Movie;
  onMoreInfo: () => void;
}

export function HeroContent({ movie, onMoreInfo }: HeroContentProps) {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        {movie.title}
      </h1>
      
      {movie.release_date && (
        <p className={styles.year}>
          ({new Date(movie.release_date).getFullYear()})
        </p>
      )}

      <div className={styles.buttons}>
        <button className={styles.btnWatch}>
          Regarder
        </button>

        <button 
          className={styles.btnInfo}
          onClick={onMoreInfo}
        >
          En savoir plus
        </button>
      </div>
    </div>
  );
}