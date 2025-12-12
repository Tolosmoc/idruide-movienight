"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import { HeroContent } from "./HeroContent/HeroContent";
import styles from "./HeroCarousel.module.css";

interface HeroCarouselProps {
  movies: Movie[];
  currentIndex: number;
  onMoreInfo: () => void;
}

export function HeroCarousel({ movies, currentIndex, onMoreInfo }: HeroCarouselProps) {
  const currentMovie = movies[currentIndex];

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
                alt={movie.title}
                width={1200}
                height={480}
                className={styles.image}
                style={{ width: '100%', height: '100%' }}
                loading="eager"
                priority
                sizes="(max-width: 900px) 95vw, 900px"
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.gradient} />

      <HeroContent 
        movie={currentMovie} 
        onMoreInfo={onMoreInfo}
      />
    </div>
  );
}