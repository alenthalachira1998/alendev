// File: src/components/layout/SideNav.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/SideNav.module.scss';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#intro', label: 'About' },
  { href: '/#intro', label: 'Contact' },
];

const SideNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <> 
      <button className={styles.hamburger} onMouseEnter={toggleNav} aria-label="Open navigation">
        ☰
      </button>
      <nav className={`${styles.sideNav} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={toggleNav} aria-label="Close navigation">
          &times;
        </button>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} 
                className={pathname === item.href ? styles.active : ''}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <SignedOut>
              <SignInButton mode="modal">
                <button className={styles.signInButton}>
                 Admin
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className={styles.userSection}>
                <UserButton  />
              </div>
            </SignedIn>
          </li>
        </ul>
      </nav>
      {isOpen && <div className={styles.overlay} onClick={toggleNav} />}
    </>
  );
};

export default SideNav;