'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { tmdbService } from '@/services/tmdb';
import { useMovieStore } from '@/store/movieStore';
import { Movie } from '@/types/movie';
import styles from './SearchBar.module.css';
import Image from 'next/image';
import { Search } from 'baseui/icon';
import { ArrowRight } from 'baseui/icon';

export function SearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Using Zustand store
  const { 
    searchQuery, 
    setSearchQuery,
    setIsSearching 
  } = useMovieStore();
  
  // Local state for suggestions dropdown
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchQuery.length <= 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const searchDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        
        setSuggestions(data.results.slice(0, 6));
        setTotalResults(data.total_results || 0);
        // Only open dropdown if input is focused
        if (isFocused && data.results.length > 0) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery, setIsSearching, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
    setSearchQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleViewAll = () => {
    handleSearch(searchQuery);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={`${styles.searchWrapper} ${searchQuery.length > 0 ? styles.searchWrapperActive : ''}`}>
        <Search size={24} className={styles.searchIcon} />
        
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Rechercher un film, un réalisateur, un acteur"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            // Re-open dropdown if there are suggestions and query is valid
            if (searchQuery.length > 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchQuery);
            }
          }}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          className={styles.suggestionsDropdown}
          onMouseDown={(e) => {
            // Prevent blur when clicking inside dropdown
            e.preventDefault();
          }}
        >
          <div className={styles.refineMessage}>
            <span>Affiner votre recherche pour plus de résultat</span>
            <span className={styles.resultCount}>
              {totalResults >= 20 ? '20+' : totalResults} résultats
            </span>
          </div>

          <div className={styles.scrollableContent}>
            {suggestions.map((movie) => (
              <div
                key={movie.id}
                className={styles.suggestionItem}
                onClick={() => handleSelectMovie(movie.id)}
              >
                <div className={styles.posterThumbnail}>
                  {movie.poster_path ? (
                    <Image
                      src={tmdbService.getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      width={48}
                      height={72}
                      className={styles.posterImage}
                    />
                  ) : (
                    <div className={styles.noPoster}>
                      <span>?</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.movieInfo}>
                  <div className={styles.movieTitle}>{movie.title}</div>
                  <div className={styles.movieYear}>
                    {movie.release_date?.substring(0, 4) || 'N/A'}
                  </div>
                </div>

                <ArrowRight size={20} className={styles.arrowIcon} />
              </div>
            ))}
          </div>

          <div className={styles.stickyFooter}>
            <div className={styles.viewAllLink} onClick={handleViewAll}>
              Voir tous les résultats
            </div>
          </div>
        </div>
      )}
    </div>
  );
}