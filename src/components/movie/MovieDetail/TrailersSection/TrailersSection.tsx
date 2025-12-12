'use client';

import Image from 'next/image';
import TriangleRight from 'baseui/icon/triangle-right';
import styles from './TrailersSection.module.css';

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TrailersSectionProps {
  videos: Video[];
}

export function TrailersSection({ videos }: TrailersSectionProps) {
  if (videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Bandes annonces</h2>
      <div className={styles.videosGrid}>
        {videos.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <div className={styles.videoThumbnail}>
              <Image
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt={video.name}
                width={344}
                height={193}
                className={styles.videoImage}
              />
              <div className={styles.playOverlay}>
                <div className={styles.playIcon}>
                  <TriangleRight size={60} />
                </div>
              </div>
            </div>
            <p className={styles.videoTitle}>{video.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}