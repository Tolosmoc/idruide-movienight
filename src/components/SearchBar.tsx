'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { tmdbService } from '@/services/tmdb';
import { Movie } from '@/types/movie';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
        const results = await tmdbService.searchMovies(query);
        setSuggestions(results.slice(0, 10));
        setIsOpen(results.length > 0);
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

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={styles.searchWrapper}>
        <svg 
          className={styles.searchIcon}
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        
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
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              className={styles.suggestionItem}
              onClick={() => handleSelectMovie(movie.id)}
            >
              {movie.title} ({movie.release_date?.substring(0, 4) || 'N/A'})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}