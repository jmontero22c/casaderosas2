'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🌹</span>
                    Casa de Rosas
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Inicio</Link>
                    <Link href="/flores" className={styles.navLink}>Flores</Link>
                    <Link href="/anchetas" className={styles.navLink}>Anchetas</Link>
                </nav>

                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menú"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            <nav className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
                <Link href="/" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                    Inicio
                </Link>
                <Link href="/flores" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                    Flores
                </Link>
                <Link href="/anchetas" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
                    Anchetas
                </Link>
            </nav>
        </header>
    );
}
