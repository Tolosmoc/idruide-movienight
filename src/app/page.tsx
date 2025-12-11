import { tmdbService } from "@/services/tmdb";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { Movie } from "@/types/movie";

export default async function Home() {
  const trending: Movie[] = await tmdbService.getTrending();

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#2b2b2b' }}>
      <Header />

      {/* HERO SECTION */}
      <HeroSection movies={trending} />

      <main className="container mx-auto px-6 pb-20">
        <MovieRow title="A l'affiche cette semaine" movies={trending.slice(0, 12)} />
        <MovieRow title="Les films les mieux notes" movies={trending.slice(5, 17)} showRating={true} />
      </main>
    </div>
  );
}