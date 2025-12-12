"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import { BlurredBackground } from "./BlurredBackground/BlurredBackground";
import { HeroCarousel } from "./HeroCarousel/HeroCarousel";
import { CarouselDots } from "./CarouselDots/CarouselDots";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselMovies = movies.slice(0, 3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [carouselMovies.length]);

  const handleMoreInfo = () => {
    const currentMovie = carouselMovies[currentIndex];
    router.push(`/movie/${currentMovie.id}`);
  };

  if (!carouselMovies.length) return null;

  return (
    <section className={styles.section}>
      <BlurredBackground 
        movies={carouselMovies} 
        currentIndex={currentIndex} 
      />

      <div className={styles.inner}>
        <div className={styles.wrapper}>
          <HeroCarousel 
            movies={carouselMovies} 
            currentIndex={currentIndex}
            onMoreInfo={handleMoreInfo}
          />

          <CarouselDots 
            count={carouselMovies.length}
            currentIndex={currentIndex}
            onDotClick={setCurrentIndex}
          />
        </div>
      </div>
    </section>
  );
}