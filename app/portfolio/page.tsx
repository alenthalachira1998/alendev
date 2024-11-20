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

  const handleSectionChange = (section: string) => {
    console.log('Changing section to:', section);
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
    handleHashChange(); // Set initial section on page load

    // Load all data
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

  const [intro, setIntro] = useState<Intro | null>(null);

  return (
    <div className={styles.portfolioContainer}>
      <TabNavigator 
        profilePicSrc="/images/avtar1.png" 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
 
      <main className={styles.content}>
        <section id="intro" className={`${styles.section} ${activeSection === 'intro' ? styles.visible : styles.hidden}`}>
          <h2>Introduction</h2>
          <IntroDisplay intro={intro} isLoading={false} />
        </section>
        <section id="tech-stack" className={`${styles.section} ${activeSection === 'tech-stack' ? styles.visible : styles.hidden}`}>
          <h2>Tech Stack</h2>
          <TechStackDisplay techStack={techStacks} onUpdate={refreshTechStack} />
        </section>
        <section id="education" className={`${styles.section} ${activeSection === 'education' ? styles.visible : styles.hidden}`}>
          <h2>Education</h2>
          <EducationDisplay />
        </section>
        <section id="experience" className={`${styles.section} ${activeSection === 'experience' ? styles.visible : styles.hidden}`}>
          <h2>Experience</h2>
          <ExperienceDisplay experiences={experiences} />
        </section>
        <section id="projects" className={`${styles.section} ${activeSection === 'projects' ? styles.visible : styles.hidden}`}>
          <h2>Projects</h2>
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