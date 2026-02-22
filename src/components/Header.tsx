'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import Image from 'next/image';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>

                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>
                        <Image
                            src="/Logo.png"
                            alt="Hero"
                            width={50}
                            height={50}
                        />
                    </span>
                    <span className={styles.logoText}>
                        Casa de Rosas
                    </span>
                </Link>

                {/* Navegación Desktop */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Inicio</Link>
                    <Link href="/#flores" className={styles.navLink}>Flores</Link>
                    <Link href="/#detallitos" className={styles.navLink}>Detallitos</Link>
                    <Link href="/#contacto" className={styles.navLink}>Contacto</Link>
                </nav>

                {/* Botón Mobile */}
                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Navegación Mobile */}
            <nav className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
                <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
                <Link href="/bienvenida" onClick={() => setMenuOpen(false)}>Bienvenida</Link>
                <Link href="/#flores" onClick={() => setMenuOpen(false)}>Flores</Link>
                <Link href="/#detallitos" onClick={() => setMenuOpen(false)}>Detallitos</Link>
                <Link href="/#contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
            </nav>
        </header>
    );
}
