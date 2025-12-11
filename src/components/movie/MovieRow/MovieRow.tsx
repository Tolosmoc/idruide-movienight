"use client";

import { Movie } from "@/types/movie";
import { MovieCard } from "@/components/movie/MovieCard/MovieCard";
import { useRef, useState, useEffect } from "react";
import styles from "./MovieRow.module.css";
import { ArrowLeft, ArrowRight } from 'baseui/icon';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  showRating?: boolean;
}

export function MovieRow({ title, movies, showRating = false }: MovieRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cardOpacities, setCardOpacities] = useState<number[]>([]);

  const updateScrollState = () => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      
      const atStart = scrollLeft <= 5;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 5;
      
      setCanScrollLeft(!atStart);
      setCanScrollRight(!atEnd);
      
      const cards = ref.current.children;
      const newOpacities: number[] = [];
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        const containerRect = ref.current.getBoundingClientRect();
        
        const cardLeft = rect.left - containerRect.left;
        const cardRight = rect.right - containerRect.left;
        const containerWidth = containerRect.width;
        
        let opacity = 1;
        
        if (cardLeft < 0) {
          const visibleWidth = rect.width + cardLeft;
          opacity = Math.max(0.2, Math.min(1, visibleWidth / rect.width));
        }
        else if (cardRight > containerWidth) {
          const visibleWidth = containerWidth - cardLeft;
          opacity = Math.max(0.2, Math.min(1, visibleWidth / rect.width));
        }
        
        newOpacities.push(opacity);
      }
      
      setCardOpacities(newOpacities);
    }
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const scroll = (amount: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
      
      setTimeout(() => {
        updateScrollState();
      }, 300);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.container}>
        {/* Left arrow */}
        <button
          onClick={() => scroll(-900)}
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <ArrowLeft size={40} />
        </button>

        {/* Movies */}
        <div className={styles.scrollWrapper}>
          <div
            ref={ref}
            className={styles.movieList}
            onScroll={updateScrollState}
          >
            {movies.map((m, index) => (
              <div
                key={m.id}
                style={{
                  opacity: cardOpacities[index] ?? 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <MovieCard movie={m} showRating={showRating} />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(900)}
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <ArrowRight size={64} />
        </button>
      </div>
    </section>
  );
}