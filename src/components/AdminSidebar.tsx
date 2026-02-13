'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/supabase/auth';
import styles from './AdminSidebar.module.css';

const navItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/productos', icon: '📦', label: 'Productos' },
    { href: '/admin/stock', icon: '📋', label: 'Stock' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/admin/login';
    };

    return (
        <>
            <button
                className={styles.mobileToggle}
                onClick={() => setOpen(!open)}
                aria-label="Menú admin"
            >
                {open ? '✕' : '☰'}
            </button>

            <div
                className={`${styles.overlay} ${open ? styles.open : ''}`}
                onClick={() => setOpen(false)}
            />

            <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>🌹</span>
                    Admin Panel
                </div>

                <span className={styles.label}>Menú</span>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => setOpen(false)}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.spacer} />

                <div className={styles.footer}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <span className={styles.navIcon}>🚪</span>
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
}
