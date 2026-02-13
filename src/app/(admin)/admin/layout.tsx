'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, onAuthStateChange } from '@/lib/supabase/auth';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        const checkAuth = async () => {
            const { session } = await getSession();
            if (!session && !isLoginPage) {
                router.replace('/admin/login');
            } else {
                setAuthenticated(!!session);
            }
            setLoading(false);
        };

        checkAuth();

        const { data: listener } = onAuthStateChange((session) => {
            setAuthenticated(!!session);
            if (!session && !isLoginPage) {
                router.replace('/admin/login');
            }
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [isLoginPage, router]);

    // Login page renders without sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading) {
        return <LoadingSpinner text="Verificando sesión..." />;
    }

    if (!authenticated) {
        return null;
    }

    return (
        <div className={styles.layoutWrapper}>
            <AdminSidebar />
            <main className={styles.mainContent}>
                <div className={styles.topBar}>
                    <span className={styles.topBarTitle}>
                        Panel de Administración — Casa de Rosas
                    </span>
                </div>
                <div className={styles.pageContent}>{children}</div>
            </main>
        </div>
    );
}
