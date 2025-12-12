'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MovieDetails } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { Header } from '@/components/layout/Header/Header';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import styles from './MovieDetail.module.css';
import { ArrowRight } from 'baseui/icon';
import TriangleRight from 'baseui/icon/triangle-right';

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieDetailPageProps {
  movieId: number;
}

export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeStar, setActiveStar] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovieDataAndPreloadImages = async () => {
      const startTime = Date.now();
      
      try {
        const [movieDetails, creditsData, videosData] = await Promise.all([
          tmdbService.getMovieDetails(movieId),
          fetch(
            `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ).then(res => res.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ).then(res => res.json())
        ]);

        setMovie(movieDetails);
        setCast(creditsData.cast?.slice(0, 11) || []);
        setVideos(videosData.results?.filter((v: Video) => v.site === 'YouTube').slice(0, 3) || []);

        const imagesToPreload: string[] = [];
        
        if (movieDetails.backdrop_path) {
          imagesToPreload.push(tmdbService.getBackdropURL(movieDetails.backdrop_path));
        }
        
        if (movieDetails.poster_path) {
          imagesToPreload.push(tmdbService.getImageUrl(movieDetails.poster_path, 'w500'));
        }

        const castPhotos = creditsData.cast
          ?.slice(0, 3)
          .filter((actor: Cast) => actor.profile_path)
          .map((actor: Cast) => tmdbService.getImageUrl(actor.profile_path!, 'w185')) || [];
        imagesToPreload.push(...castPhotos);

        const firstVideo = videosData.results?.filter((v: Video) => v.site === 'YouTube')[0];
        if (firstVideo) {
          imagesToPreload.push(`https://img.youtube.com/vi/${firstVideo.key}/hqdefault.jpg`);
        }

        await Promise.all(
          imagesToPreload.map(src => {
            return new Promise((resolve) => {
              const img = new window.Image();
              img.src = src;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              
              // Timeout after 10 seconds to prevent infinite loading
              setTimeout(() => resolve(false), 10000);
            });
          })
        );

        if (movieDetails.backdrop_path) {
          extractColor(movieDetails.backdrop_path);
        }

        const elapsedTime = Date.now() - startTime;
        const minimumLoadingTime = 2000; // 2 seconds minimum
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setImagesLoaded(true);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching movie data:', error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setLoading(false);
      }
    };

    fetchMovieDataAndPreloadImages();
  }, [movieId]);

  const extractColor = async (backdropPath: string) => {
    try {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = tmdbService.getBackdropURL(backdropPath);
      
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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

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
    }
  };

  if (loading || !imagesLoaded) {
    return <LoadingScreen />;
  }

  if (!movie) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Film non trouvé</div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.backdropContainer}>
        {movie.backdrop_path && (
          <Image
            src={tmdbService.getBackdropURL(movie.backdrop_path)}
            alt=""
            fill
            className={styles.backdropBlurred}
            priority
          />
        )}
        <div ref={glowRef} className={styles.backdropOverlay} />
      </div>

      <main className={styles.main}>
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
                    style={{ width: `${(movie.vote_average * 10) * 2.5}px` }}
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
                      fill="transparent"   // <-- default transparent
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

        {/* Trailers section */}
        {videos.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Bandes annonces</h2>
            <div className={styles.videosGrid}>
              {videos.map((video) => (
                <div key={video.id} className={styles.videoCard}>
                  <div className={styles.videoThumbnail}>
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                      alt={video.name}
                      width={344}
                      height={193}
                      className={styles.videoImage}
                    />
                    <div className={styles.playOverlay}>
                      <div className={styles.playIcon}>
                        <TriangleRight size={60} />
                      </div>
                    </div>
                  </div>
                  <p className={styles.videoTitle}>{video.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast section */}
        {cast.length > 0 && (
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
              
              <div className={styles.viewAllCard}>
                <div className={styles.viewAllContent}>
                  <span>Voir tout</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}