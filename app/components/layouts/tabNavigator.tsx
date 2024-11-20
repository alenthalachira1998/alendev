import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/tabNavigation.module.scss';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '#intro', label: 'INTRO' },
  { href: '#tech-stack', label: 'TECH STACK' },
  { href: '#education', label: 'EDUCATION' },
  { href: '#experience', label: 'EXPERIENCE' },
  { href: '#projects', label: 'PROJECTS' },
];

interface TabNavigatorProps {
  profilePicSrc: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ profilePicSrc, activeSection, onSectionChange }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const section = href.substring(1); // Extract section name from href (e.g., "#intro" -> "intro")
    onSectionChange(section);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.profilePic}>
        <img
          src={profilePicSrc}
          alt="Profile Picture"
        />
      </div>
      <ul className={styles.navItems}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={activeSection === item.href.substring(1) ? styles.active : ''}
              onClick={(e) => handleClick(e, item.href)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabNavigator;
