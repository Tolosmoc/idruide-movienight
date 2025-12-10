'use client';

import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
            MOVIENIGHT
          </Link>
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}