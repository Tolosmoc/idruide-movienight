'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            MOVIENIGHT
          </Link>
          <div className={styles.searchContainer}>
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}