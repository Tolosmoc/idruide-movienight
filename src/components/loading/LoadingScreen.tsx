'use client';

import { Header } from '@/components/layout/Header/Header';
import Spinner from 'baseui/icon/spinner';
import styles from './LoadingScreen.module.css';

export function LoadingScreen() {
  return (
    <div className={styles.loadingPage}>
      <Header />
      <div className={styles.spinnerContainer}>
        <Spinner size={64} className={styles.spinner} />
      </div>
    </div>
  );
}