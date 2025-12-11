"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import styles from "./HeroSection.module.css";

export function HeroSection({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselMovies = movies.slice(0, 3);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [carouselMovies.length]);

  useEffect(() => {
    const extractColor = async () => {
      const currentMovie = carouselMovies[currentIndex];
      if (!currentMovie?.backdrop_path) return;

      try {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.src = tmdbService.getBackdropURL(currentMovie.backdrop_path);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample colors from multiple areas of the image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        let count = 0;

        // Sample every 10th pixel for better performance
        for (let i = 0; i < data.length; i += 40) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Boost saturation and brightness
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        
        if (saturation < 0.4) {
          const boost = 1.6;
          r = Math.min(255, r * boost);
          g = Math.min(255, g * boost);
          b = Math.min(255, b * boost);
        }

        if (glowRef.current) {
          glowRef.current.style.background = `
            radial-gradient(ellipse 900px 600px at 50% 25%, rgba(${r}, ${g}, ${b}, 0.3) 0%, rgba(${r}, ${g}, ${b}, 0.15) 40%, transparent 70%),
            linear-gradient(to bottom, 
              transparent 0%, 
              transparent 60%, 
              rgba(43, 43, 43, 0.3) 75%,
              rgba(43, 43, 43, 0.7) 85%,
              #2b2b2b 100%
            )
          `;
        }
      } catch (error) {
        console.error('Error extracting color:', error);
        if (glowRef.current) {
          glowRef.current.style.background = `
            radial-gradient(ellipse 900px 600px at 50% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 70%),
            linear-gradient(to bottom, 
              transparent 0%, 
              transparent 60%, 
              rgba(43, 43, 43, 0.3) 75%,
              rgba(43, 43, 43, 0.7) 85%,
              #2b2b2b 100%
            )
          `;
        }
      }
    };

    extractColor();
  }, [currentIndex, carouselMovies]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!carouselMovies.length) return null;

  const currentMovie = carouselMovies[currentIndex];

  return (
    <section className={styles.heroSection}>
      <div className={styles.glowContainer}>
        <div 
          className={styles.glowTrack}
          style={{ transform: `translateY(-${currentIndex * 33.333}%)` }}
        >
          {carouselMovies.map((movie) => (
            <div key={movie.id} className={styles.glowSlide}>
              {movie.backdrop_path && (
                <Image
                  src={tmdbService.getBackdropURL(movie.backdrop_path)}
                  alt=""
                  width={1200}
                  height={600}
                  className={styles.glowBlurredImage}
                  loading="eager"
                  priority
                />
              )}
            </div>
          ))}
        </div>
        <div ref={glowRef} className={styles.glowColorOverlay} />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.carouselWrapper}>
          <div className={styles.carouselContainer}>
            <div 
              className={styles.carouselTrack}
              style={{ transform: `translateY(-${currentIndex * 33.333}%)` }}
            >
              {carouselMovies.map((movie) => (
                <div key={movie.id} className={styles.carouselSlide}>
                  {movie.backdrop_path && (
                    <Image
                      src={tmdbService.getBackdropURL(movie.backdrop_path)}
                      alt={movie.title}
                      width={1200}
                      height={480}
                      className={styles.heroImage}
                      style={{ width: '100%', height: '100%' }}
                      loading="eager"
                      priority
                      sizes="(max-width: 900px) 95vw, 900px"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.heroGradient} />

            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                {currentMovie.title}
              </h1>
              
              {currentMovie.release_date && (
                <p className={styles.heroYear}>
                  ({new Date(currentMovie.release_date).getFullYear()})
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
          </div>

          <div className={styles.carouselDots}>
            {carouselMovies.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}