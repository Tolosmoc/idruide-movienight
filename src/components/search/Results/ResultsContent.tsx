'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { MovieCard } from '@/components/movie/MovieCard/MovieCard';
import { Movie } from '@/types/movie';
import { useEffect, useState, useRef } from 'react';
import styles from './results.module.css';

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        
        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
        setPage(1);
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialResults();
  }, [query]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${nextPage}`
      );
      const data = await response.json();
      
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, query]);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.query}>{query}</h1>
          <p className={styles.resultCount}>{totalResults} résultats</p>
        </div>

        <div className={styles.grid}>
          {movies.map((movie) => (
            <div key={`${movie.id}-${movie.title}`} className={styles.gridItem}>
              <MovieCard movie={movie} showRating={false} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div ref={observerTarget} className={styles.loadingContainer}>
            {loading && (
              <div className={styles.spinner}>
                <div className={styles.spinnerCircle}></div>
              </div>
            )}
          </div>
        )}

        {!hasMore && movies.length > 0 && (
          <div className={styles.endMessage}>
            Tous les résultats ont été chargés
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className={styles.noResults}>
            <p>Aucun résultat trouvé pour `{query}`</p>
          </div>
        )}
      </main>
    </div>
  );
}