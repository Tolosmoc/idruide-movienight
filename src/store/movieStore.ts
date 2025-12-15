import { create } from "zustand";
import { Movie, MovieDetails } from "@/types/movie";

interface MovieState {
    // Search state
    searchResults: Movie[];
    searchQuery: string;
    searchTotalResults: number;
    searchPage: number;
    searchHasMore: boolean;
    
    // Movie details state
    selectedMovie: MovieDetails | null;
    
    // Home page state
    trendingMovies: Movie[];
    topRatedMovies: Movie[];
    
    // Loading states
    isSearching: boolean;
    isLoadingMovieDetails: boolean;
    
    // Actions
    setSearchResults: (movies: Movie[], totalResults: number, page: number, hasMore: boolean) => void;
    appendSearchResults: (movies: Movie[], page: number, hasMore: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSelectedMovie: (movie: MovieDetails | null) => void;
    setTrendingMovies: (movies: Movie[]) => void;
    setTopRatedMovies: (movies: Movie[]) => void;
    setIsSearching: (loading: boolean) => void;
    setIsLoadingMovieDetails: (loading: boolean) => void;
    resetSearch: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    // Initial state
    searchResults: [],
    searchQuery: "",
    searchTotalResults: 0,
    searchPage: 1,
    searchHasMore: true,
    selectedMovie: null,
    trendingMovies: [],
    topRatedMovies: [],
    isSearching: false,
    isLoadingMovieDetails: false,
    
    // Actions
    setSearchResults: (movies, totalResults, page, hasMore) => 
        set({ 
            searchResults: movies, 
            searchTotalResults: totalResults,
            searchPage: page,
            searchHasMore: hasMore
        }),
    
    appendSearchResults: (movies, page, hasMore) =>
        set((state) => ({
            searchResults: [...state.searchResults, ...movies],
            searchPage: page,
            searchHasMore: hasMore
        })),
    
    setSearchQuery: (query) => set({ searchQuery: query }),
    
    setSelectedMovie: (movie) => set({ selectedMovie: movie }),
    
    setTrendingMovies: (movies) => set({ trendingMovies: movies }),
    
    setTopRatedMovies: (movies) => set({ topRatedMovies: movies }),
    
    setIsSearching: (loading) => set({ isSearching: loading }),
    
    setIsLoadingMovieDetails: (loading) => set({ isLoadingMovieDetails: loading }),
    
    resetSearch: () => set({ 
        searchResults: [], 
        searchQuery: "",
        searchTotalResults: 0,
        searchPage: 1,
        searchHasMore: true 
    }),
}));