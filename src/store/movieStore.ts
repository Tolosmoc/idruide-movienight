import { create } from "zustand";
import { Movie } from "@/types/movie";

interface MovieState {
    searchResults: Movie[];
    selectedMovie: Movie | null;
    setSearchResults: (movies: Movie[]) => void;
    setSelectedMovie: (movie: Movie | null) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    searchResults: [],
    selectedMovie: null,
    setSearchResults: (movies) => set({ searchResults: movies }),
    setSelectedMovie: (movie) => set({ selectedMovie: movie}),
}));