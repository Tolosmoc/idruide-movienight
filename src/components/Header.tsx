'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
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