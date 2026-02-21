'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

interface Stats {
    totalProducts: number;
    totalFlores: number;
    totalAnchetas: number;
    lowStock: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data: products } = await supabase
                    .from('products')
                    .select('*, categories!inner(slug)');

                if (products) {
                    const flores = products.filter(
                        (p: Record<string, unknown>) =>
                            (p.categories as Record<string, unknown>)?.slug === 'flores'
                    );
                    const anchetas = products.filter(
                        (p: Record<string, unknown>) =>
                            (p.categories as Record<string, unknown>)?.slug === 'anchetas'
                    );
                    const lowStock = products.filter(
                        (p: Record<string, unknown>) => (p.stock as number) <= 3
                    );

                    setStats({
                        totalProducts: products.length,
                        totalFlores: flores.length,
                        totalAnchetas: anchetas.length,
                        lowStock: lowStock.length,
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.welcome}>
                Bienvenido al panel de administración de Casa de Rosas.
            </p>

            <div className={styles.dashboard}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statValue}>{stats?.totalProducts ?? 0}</div>
                    <div className={styles.statLabel}>Productos totales</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🌸</div>
                    <div className={styles.statValue}>{stats?.totalFlores ?? 0}</div>
                    <div className={styles.statLabel}>Flores</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎁</div>
                    <div className={styles.statValue}>{stats?.totalAnchetas ?? 0}</div>
                    <div className={styles.statLabel}>Anchetas</div>
                </div>
            </div>
        </div>
    );
}
