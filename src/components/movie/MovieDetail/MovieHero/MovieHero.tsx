'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MovieDetails } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import styles from './MovieHero.module.css';

interface MovieHeroProps {
  movie: MovieDetails;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const [activeStar, setActiveStar] = useState(false);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.leftContent}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              {movie.title}
              <span className={styles.year}>({releaseYear})</span>
            </h1>
            {movie.adult !== undefined && (
              <div className={styles.ratingBadge}>
                {movie.adult ? '18+' : 'PG'}
              </div>
            )}
          </div>

          <div className={styles.metadata}>
            <span>{movie.genres.map(g => g.name).join(', ')}</span>
          </div>

          <div className={styles.durationRating}>
            {movie.runtime && (
              <span className={styles.duration}>
                {Math.floor(movie.runtime / 60)}h{(movie.runtime % 60).toString().padStart(2, '0')}m
              </span>
            )}
            <div className={styles.ratingBar}>
              <div 
                className={styles.ratingFill} 
                style={{ width: `${(movie.vote_average * 8)}px` }}
              />
              <span className={styles.ratingText}>{Math.round(movie.vote_average * 10)}%</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.playButton}>
              Regarder
            </button>
            <button
              className={`${styles.bookmarkButton} ${activeStar ? styles.activeStar : ""}`}
              onClick={() => setActiveStar(!activeStar)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                />
              </svg>
            </button>
          </div>

          <div className={styles.synopsis}>
            <h2 className={styles.sectionTitle}>Synopsis</h2>
            <p className={styles.synopsisText}>{movie.overview || 'Aucun synopsis disponible.'}</p>
          </div>

          <div className={styles.credits}>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Réalisateur</span>
              <span className={styles.creditValue}>Jeff Fowler</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Scénariste</span>
              <span className={styles.creditValue}>Josh Miller</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Production</span>
              <span className={styles.creditValue}>Neal H. Moritz</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Musique</span>
              <span className={styles.creditValue}>Tom Holkenborg</span>
            </div>
          </div>
        </div>

        <div className={styles.posterContainer}>
          {movie.poster_path ? (
            <Image
              src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              width={436}
              height={654}
              className={styles.poster}
              priority
            />
          ) : (
            <div className={styles.noPoster}>No poster</div>
          )}
        </div>
      </div>
    </div>
  );
}