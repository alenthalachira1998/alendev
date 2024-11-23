import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../styles/tabNavigation.module.scss';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { 
  FaHome, 
  FaLaptopCode, 
  FaUniversity, 
  FaBriefcase, 
  FaCodeBranch,
  FaSignInAlt
} from 'react-icons/fa';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '#intro', label: 'INTRO', icon: <FaHome /> },
  { href: '#tech-stack', label: 'TECH STACK', icon: <FaLaptopCode /> },
  { href: '#education', label: 'EDUCATION', icon: <FaUniversity /> },
  { href: '#experience', label: 'EXPERIENCE', icon: <FaBriefcase /> },
  { href: '#projects', label: 'PROJECTS', icon: <FaCodeBranch /> },
];

interface TabNavigatorProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ activeSection, onSectionChange }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const section = href.substring(1);
    onSectionChange(section);
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 60;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.desktopNav}>
        <ul className={styles.navItems}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${activeSection === item.href.substring(1) ? styles.active : ''}`}
                onClick={(e) => handleClick(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <SignedOut>
            <li>
              <Link
                href="/signin"
                className={styles.navLink}
              >
                SIGN IN
              </Link>
            </li>
          </SignedOut>
        </ul>
      </div>
      
      <div className={styles.mobileNav}>
        <ul className={styles.mobileNavItems}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.mobileNavLink} ${activeSection === item.href.substring(1) ? styles.active : ''}`}
                onClick={(e) => handleClick(e, item.href)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          ))}
          <SignedOut>
            <li>
              <Link
                href="/signin"
                className={styles.mobileNavLink}
              >
                <span className={styles.icon}><FaSignInAlt /></span>
                <span className={styles.label}>SIGN IN</span>
              </Link>
            </li>
          </SignedOut>
        </ul>
      </div>
    </nav>
  );
};

export default TabNavigator;
