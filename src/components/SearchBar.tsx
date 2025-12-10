'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from 'baseui/input';
import { Popover } from 'baseui/popover';
import { Menu } from 'baseui/menu';
import { tmdbService } from '@/services/tmdb';
import { Movie } from '@/types/movie';
import { Search } from 'baseui/icon';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const router = useRouter();

  const isOpen = query.length > 2 && suggestions.length > 0;

  useEffect(() => {
    if (query.length <= 2) {
      const id = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(id);
    }

    const searchDebounce = setTimeout(async () => {
      try {
        const results = await tmdbService.searchMovies(query);
        setSuggestions(results.slice(0, 10));
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/film/${movieId}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={() => setSuggestions([])}
      content={() => (
        <Menu
          items={suggestions.map((movie) => ({
            label: `${movie.title} (${movie.release_date?.substring(0, 4) || 'N/A'})`,
            id: movie.id,
          }))}
          overrides={{
            List: {
              style: {
                maxHeight: '400px',
                overflow: 'auto',
                width: '100%',
              },
            },
            ListItem: {
              props: {
                onClick: (e: React.SyntheticEvent, item: { id: number }) => {
                  handleSelectMovie(item.id);
                },
              },
            },
          }}
        />
      )}
      placement="bottom"
    >
      <div>
        <Input
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          placeholder="Rechercher un film, un realisateur, un acteur"
          startEnhancer={<Search size={24} />}
          overrides={{
            Root: {
              style: {
                backgroundColor: '#1f2937',
                borderTopWidth: '1px',
                borderRightWidth: '1px',
                borderBottomWidth: '1px',
                borderLeftWidth: '1px',
                borderTopStyle: 'solid',
                borderRightStyle: 'solid',
                borderBottomStyle: 'solid',
                borderLeftStyle: 'solid',
                borderTopColor: '#374151',
                borderRightColor: '#374151',
                borderBottomColor: '#374151',
                borderLeftColor: '#374151',
              },
            },
            Input: {
              style: {
                backgroundColor: '#1f2937',
                color: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Popover>
  );
}