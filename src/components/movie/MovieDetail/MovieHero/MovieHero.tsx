'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MovieDetails } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import styles from './MovieHero.module.css';

interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

interface MovieHeroProps {
  movie: MovieDetails;
  crew: Crew[];
}

export function MovieHero({ movie, crew }: MovieHeroProps) {
  const [activeStar, setActiveStar] = useState(false);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  const getCrewByJob = (job: string) => {
    const member = crew.find(c => c.job === job);
    return member ? member.name : 'N/A';
  };

  const director = getCrewByJob('Director');
  
  const writer = crew.find(c => 
    c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story'
  )?.name || 'N/A';
  
  const producer = crew.find(c => 
    c.job === 'Producer' || c.job === 'Executive Producer'
  )?.name || 'N/A';
  
  const composer = getCrewByJob('Original Music Composer');

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
              <span className={styles.creditValue}>{director}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Scénariste</span>
              <span className={styles.creditValue}>{writer}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Production</span>
              <span className={styles.creditValue}>{producer}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>Musique</span>
              <span className={styles.creditValue}>{composer}</span>
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