import { Suspense } from 'react';
import ResultsContent from '@/components/search/Results/ResultsContent';
import { Header } from '@/components/layout/Header/Header';
import styles from '@/components/search/Results/results.module.css';

function ResultsLoading() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.query}>Chargement...</h1>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle}></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  );
}