'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from "next/image";
import styles from './styles/Home.module.scss';
import SideNav from "@/components/layouts/sidenav";

const DynamicPortfolio = dynamic(() => import('./portfolio/page'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const text = "Sorry, This website under construction";
  const portfolioRef = useRef<HTMLDivElement>(null);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <header className={styles.header}>
          <nav>
            <SideNav/>
          </nav>
        </header>
        <div className={styles.content}>
          <div 
            className={styles.digitalTextTyping}
            style={{
              '--character-count': text.length,
              '--typing-duration': `${text.length * 0.15}s`
            } as React.CSSProperties}
          >
            {text}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/banner.png"
              alt="Software Development Setup"
              className={styles.mainImage}
              width={600}
              height={400}
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>
        <div className={styles.scrollIndicatorContainer} onClick={scrollToPortfolio}>
          <Image 
            width={50} 
            height={50} 
            src="/images/arrow.svg" 
            alt="Scroll to portfolio" 
            className={styles.scrollIndicator}
          />
        </div>
      </main>
      <div ref={portfolioRef} className={styles.portfolioSection}>
        <DynamicPortfolio />
      </div>
    </div>
  );
}