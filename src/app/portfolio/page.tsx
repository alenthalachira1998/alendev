import React, { useState, useEffect } from 'react';
import styles from '../styles/portfolio.module.scss';
import { useRouter } from 'next/navigation';
import TabNavigator from '@/components/layouts/tabNavigator';

const PortfolioPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.history.pushState(null, '', `#${section}`);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setActiveSection(hash || 'intro');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial section on page load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className={styles.portfolioContainer}>
      <TabNavigator 
        profilePicSrc="/images/avtar1.png" 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className={styles.content}>
        {['intro', 'tech-stack', 'education', 'experience', 'projects'].map((section) => (
          <section
            key={section}
            id={section}
            className={`${styles.section} ${activeSection === section ? styles.visible : styles.hidden}`}
          >
            <h2>{section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}</h2>
            {/* Add your content for each section here */}
          </section>
        ))}
      </main>
    </div>
  );
};

export default PortfolioPage;