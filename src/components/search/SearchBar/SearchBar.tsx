'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { tmdbService } from '@/services/tmdb';
import { Movie } from '@/types/movie';
import styles from './SearchBar.module.css';
import Image from 'next/image';
import { Search } from 'baseui/icon';
import { ArrowRight } from 'baseui/icon';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length <= 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const searchDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        
        setSuggestions(data.results.slice(0, 6));
        setTotalResults(data.total_results || 0);
        setIsOpen(data.results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/film/${movieId}`);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleViewAll = () => {
    handleSearch(query);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={`${styles.searchWrapper} ${query.length > 0 ? styles.searchWrapperActive : ''}`}>
        <Search size={24} className={styles.searchIcon} />
        
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Rechercher un film, un réalisateur, un acteur"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className={styles.suggestionsDropdown}>
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