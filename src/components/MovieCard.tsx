'use client';

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/film/${movie.id}`} className="w-[180px] flex-shrink-0 group">
      <div className="w-full">
        {/* Poster ratio 2/3 */}
        <div className="relative w-full rounded-lg overflow-hidden aspect-[2/3] shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
          <Image
            src={tmdbService.getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="mt-3 text-sm font-semibold truncate">{movie.title}</h3>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
          <span className="flex items-center gap-1">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}