import { tmdbService } from "@/services/tmdb";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { Movie } from "@/types/movie";

export default async function Home() {
  const trending: Movie[] = await tmdbService.getTrending();

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-orange-900 via-gray-900 to-black">
      <Header />

      {/* HERO SECTION */}
      <div className="px-4 pt-8">
        <HeroSection movie={trending[0]} />
      </div>

      <main className="container mx-auto px-4 pb-16">
        <MovieRow title="À l'affiche cette semaine" movies={trending.slice(0, 10)} />
        <MovieRow title="Les films les mieux notés" movies={trending.slice(5, 15)} />
      </main>
    </div>
  );
}