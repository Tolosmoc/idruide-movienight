"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./HeroSection.module.css";

export function HeroSection({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <section className={styles.heroSection}>
      {movie.backdrop_path && (
        <Image
          src={tmdbService.getBackdropURL(movie.backdrop_path)}
          alt={movie.title}
          width={1200}
          height={360}
          className={styles.heroImage}
          style={{ width: '100%', height: '100%' }}
          loading="eager"
          priority
          sizes="(max-width: 1200px) 95vw, 1200px"
        />
      )}
      
      <div className={styles.heroGradient} />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {movie.title}
        </h1>
        
        {movie.release_date && (
          <p className={styles.heroYear}>
            ({new Date(movie.release_date).getFullYear()})
          </p>
        )}

        <div className={styles.heroButtons}>
          <button className={styles.btnWatch}>
            Regarder
          </button>

          <button className={styles.btnInfo}>
            En savoir plus
          </button>
        </div>
      </div>
    </section>
  );
}