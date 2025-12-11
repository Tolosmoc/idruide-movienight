import { Movie, MovieDetails, TMDBResponse } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;

export const tmdbService = {
    async getTrending(): Promise<Movie[]> {
        const response = await fetch(
            `${API_URL}/trending/movie/week?api_key=${API_KEY}`
        );
        const data: TMDBResponse = await response.json();
        return data.results;
    },

    async getTopRated(): Promise<Movie[]> {
        const response = await fetch(
            `${API_URL}/movie/top_rated?api_key=${API_KEY}`
        );
        const data: TMDBResponse = await response.json();
        return data.results;
    },

    async searchMovies(query: string): Promise<Movie[]> {
        const response = await fetch(
            `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data: TMDBResponse = await response.json();
        return data.results;
    },

    async getMovieDetails(id: number): Promise<MovieDetails> {
        const response = await fetch(
            `${API_URL}/movie/${id}?api_key=${API_KEY}`
        );
        return response.json();
    },

    getImageUrl(path: string | null, size: string = 'w500'): string {
        if(!path) return '';
        return `${IMAGE_URL}/${size}${path}`;
    },

    getPosterURL(path: string | null): string {
        return this.getImageUrl(path, 'w500');
    },

    getBackdropURL(path: string | null): string {
        return this.getImageUrl(path, 'original');
    },
};