import { tmdbService } from "@/services/tmdb";
import { Header } from "@/components/layout/Header/Header";
import { HeroSection } from "@/components/movie/HeroSection/HeroSection";
import { MovieRow } from "@/components/movie/MovieRow/MovieRow";
import { Movie } from "@/types/movie";

export default async function Home() {
  const trending: Movie[] = await tmdbService.getTrending();
  const topRated: Movie[] = await tmdbService.getTopRated();

  const heroMovies = [...trending]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 3);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#2b2b2b' }}>
      <Header />

      {/* HERO SECTION - Top 3 best-rated from trending */}
      <HeroSection movies={heroMovies} />

      <main className="container mx-auto px-6 pb-20">
        {/* First row: In theaters this week */}
        <MovieRow title="A l'affiche cette semaine" movies={trending.slice(0, 12)} />
        
        {/* Second row: Best rated movies of all time */}
        <MovieRow title="Les films les mieux notes" movies={topRated.slice(0, 12)} showRating={true} />
      </main>
    </div>
  );
}