'use client'

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/portfolio.module.scss';
import TabNavigator from '../components/layouts/tabNavigator';
import ExperienceDisplay from '../components/ExperienceDisplay';
import EducationDisplay from '../components/EducationDisplay';
import TechStackDisplay from '../components/TechStackDisplay';
import ProjectsDisplay from '../components/ProjectsDisplay';
import IntroDisplay from '../components/IntroDisplay';
import { loadExperiences, loadEducation, loadTechStack, loadIntro, loadProjects, JobExperience, Education, TechStack, Project, Intro } from '../../lib/actions';

const PortfolioPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [experiences, setExperiences] = useState<JobExperience[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [intro, setIntro] = useState<Intro | null>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.history.pushState(null, '', `#${section}`);
  };

  const refreshTechStack = useCallback(() => {
    loadTechStack().then(setTechStacks);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setActiveSection(hash || 'intro');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    loadExperiences().then(setExperiences);
    loadTechStack().then(setTechStacks);
    loadIntro().then(setIntro);
    loadProjects().then(projects => setProjects(projects.map(project => ({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : []
    }))));

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className={styles.portfolioContainer}>
      <TabNavigator 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
 
      <main className={styles.content}>
        <section id="intro" className={`${styles.section} ${activeSection === 'intro' ? styles.visible : styles.hidden}`}>
          <IntroDisplay intro={intro} isLoading={false} />
        </section>
        <section id="tech-stack" className={`${styles.section} ${activeSection === 'tech-stack' ? styles.visible : styles.hidden}`}>
          <TechStackDisplay techStack={techStacks} onUpdate={refreshTechStack} />
        </section>
        <section id="education" className={`${styles.section} ${activeSection === 'education' ? styles.visible : styles.hidden}`}>
          <EducationDisplay />
        </section>
        <section id="experience" className={`${styles.section} ${activeSection === 'experience' ? styles.visible : styles.hidden}`}>
          <ExperienceDisplay experiences={experiences} />
        </section>
        <section id="projects" className={`${styles.section} ${activeSection === 'projects' ? styles.visible : styles.hidden}`}>
          <ProjectsDisplay projects={projects.map(project => ({
            ...project,
            technologies: Array.isArray(project.technologies) ? project.technologies : []
          }))} />
        </section>
      </main>
    </div>
  );
};

export default PortfolioPage;