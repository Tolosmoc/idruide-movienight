"use client";

import styles from "./CarouselDots.module.css";

interface CarouselDotsProps {
  count: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export function CarouselDots({ count, currentIndex, onDotClick }: CarouselDotsProps) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}