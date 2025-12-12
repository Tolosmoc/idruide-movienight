'use client';

import Image from 'next/image';
import { ArrowRight } from 'baseui/icon';
import { tmdbService } from '@/services/tmdb';
import styles from './CastSection.module.css';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastSectionProps {
  cast: Cast[];
}

export function CastSection({ cast }: CastSectionProps) {
  if (cast.length === 0) return null;

  // Show button only if there are more than 10 cast members
  const showButton = cast.length > 10;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Casting</h2>
      <div className={styles.castGrid}>
        {cast.map((actor) => (
          <div key={actor.id} className={styles.castCard}>
            <div className={styles.actorPhoto}>
              {actor.profile_path ? (
                <Image
                  src={tmdbService.getImageUrl(actor.profile_path, 'w185')}
                  alt={actor.name}
                  width={160}
                  height={160}
                  className={styles.actorImage}
                />
              ) : (
                <div className={styles.noPhoto}>?</div>
              )}
            </div>
            <div className={styles.actorInfo}>
              <p className={styles.actorName}>{actor.name}</p>
              <p className={styles.characterName}>{actor.character}</p>
            </div>
          </div>
        ))}
        
        {showButton && (
          <div className={styles.viewAllCard}>
            <div className={styles.viewAllContent}>
              <span>Voir tout</span>
              <ArrowRight size={20} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}