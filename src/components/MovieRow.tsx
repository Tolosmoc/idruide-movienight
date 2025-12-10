"use client";

import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import styles from "./MovieRow.module.css";

export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (amount: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
      
      setTimeout(() => {
        if (ref.current) {
          setShowLeftArrow(ref.current.scrollLeft > 0);
          setShowRightArrow(
            ref.current.scrollLeft < ref.current.scrollWidth - ref.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.container}>
        {showLeftArrow && (
          <button
            onClick={() => scroll(-900)}
            className={`${styles.arrow} ${styles.arrowLeft}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} strokeWidth={3} />
          </button>
        )}

        <div
          ref={ref}
          className={styles.movieList}
          onScroll={(e) => {
            const target = e.currentTarget;
            setShowLeftArrow(target.scrollLeft > 0);
            setShowRightArrow(
              target.scrollLeft < target.scrollWidth - target.clientWidth - 10
            );
          }}
        >
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll(900)}
            className={`${styles.arrow} ${styles.arrowRight}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={32} strokeWidth={3} />
          </button>
        )}
      </div>
    </section>
  );
}