"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";

export function HeroSection({ movie }: { movie: Movie }) {
  return (
    <section className="relative w-full max-w-6xl mx-auto h-[420px] rounded-xl overflow-hidden shadow-2xl mb-8">
      <Image
        src={tmdbService.getBackdropURL(movie.backdrop_path)}
        alt={movie.title}
        fill
        className="object-cover"
        loading="eager"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />

      <div className="absolute bottom-12 left-12 max-w-2xl">
        <h1 className="text-5xl font-bold drop-shadow-lg mb-2">
          {movie.title}
        </h1>
        
        {movie.release_date && (
          <p className="text-lg text-gray-200 mb-6">
            ({new Date(movie.release_date).getFullYear()})
          </p>
        )}

        <div className="flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition">
            Regarder
          </button>

          <button className="bg-white/20 backdrop-blur-sm border border-white/40 px-6 py-3 rounded-md font-semibold hover:bg-white/30 transition">
            En savoir plus
          </button>
        </div>
      </div>
    </section>
  );
}