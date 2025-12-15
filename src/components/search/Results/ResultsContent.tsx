'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { MovieCard } from '@/components/movie/MovieCard/MovieCard';
import { useMovieStore } from '@/store/movieStore';
import { useEffect, useRef } from 'react';
import styles from './results.module.css';

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const {
    searchResults,
    searchTotalResults,
    searchPage,
    searchHasMore,
    isSearching,
    setSearchResults,
    appendSearchResults,
    setSearchQuery,
    setIsSearching,
    resetSearch
  } = useMovieStore();
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialResults = async () => {
      if (!query) return;
      
      resetSearch();
      setSearchQuery(query);
      setIsSearching(true);
      
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        
        setSearchResults(
          data.results || [],
          data.total_results || 0,
          1,
          data.page < data.total_pages
        );
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchInitialResults();
  }, [query, resetSearch, setSearchQuery, setSearchResults, setIsSearching]);

  const loadMore = async () => {
    if (isSearching || !searchHasMore) return;
    
    setIsSearching(true);
    try {
      const nextPage = searchPage + 1;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${nextPage}`
      );
      const data = await response.json();
      
      appendSearchResults(
        data.results || [],
        nextPage,
        data.page < data.total_pages
      );
    } catch (error) {
      console.error('Error loading more results:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && searchHasMore && !isSearching) {
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
  }, [searchHasMore, isSearching, searchPage, query]);

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.query}>{query}</h1>
          <p className={styles.resultCount}>{searchTotalResults} résultats</p>
        </div>

        <div className={styles.grid}>
          {searchResults.map((movie) => (
            <div key={`${movie.id}-${movie.title}`} className={styles.gridItem}>
              <MovieCard movie={movie} showRating={false} />
            </div>
          ))}
        </div>

        {searchHasMore && (
          <div ref={observerTarget} className={styles.loadingContainer}>
            {isSearching && (
              <div className={styles.spinner}>
                <div className={styles.spinnerCircle}></div>
              </div>
            )}
          </div>
        )}

        {!searchHasMore && searchResults.length > 0 && (
          <div className={styles.endMessage}>
            Tous les résultats ont été chargés
          </div>
        )}

        {!isSearching && searchResults.length === 0 && (
          <div className={styles.noResults}>
            <p>Aucun résultat trouvé pour `{query}`</p>
          </div>
        )}
      </main>
    </div>
  );
}