"use client";

import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (amount: number) => {
    ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-600)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Movie List */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto no-scrollbar px-2 py-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(600)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}