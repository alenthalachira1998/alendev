'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from "next/image";
import styles from './styles/Home.module.scss';

const DynamicPortfolio = dynamic(() => import('./portfolio/page'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const text = "Alen Jose\nSoftware Dev";
  const portfolioRef = useRef<HTMLDivElement>(null);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div 
            className={`${styles.digitalTextTyping} mb-4`}
            style={{
              '--character-count': text.length,
              '--typing-duration': `${text.length * 0.15}s`,
              whiteSpace: 'pre-line'
            } as React.CSSProperties}
          >
            {text.split('\n').map((line, i) => (
              <span key={i} className={i === 0 ? 'block mb-8' : 'block'}>
                {line}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.scrollIndicatorContainer} onClick={scrollToPortfolio}>
          <Image 
            width={60} 
            height={60} 
            src="/images/arrow.svg" 
            alt="Scroll to portfolio" 
            className={styles.scrollIndicator}
            priority
          />
        </div>
      </main>
      <div ref={portfolioRef} className={styles.portfolioSection}>
        <DynamicPortfolio />
      </div>
    </div>
  );
}