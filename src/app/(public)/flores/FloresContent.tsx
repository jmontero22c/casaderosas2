'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SubBar from '@/components/SubBar';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import styles from '../catalog.module.css';

const PAGE_SIZE = 12;

interface Category { name: string; slug: string }

interface RawProduct {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    is_active: boolean;
    category_id: string;
    created_at: string;
    updated_at: string;
    categories?: { name: string; slug: string };
}

interface Props {
    products: RawProduct[];
    categories: Category[];
    currentCategory: string;
}

export default function FloresContent({ products, categories, currentCategory }: Props) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'recientes' | 'az'>('recientes');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let arr = [...products];

        if (search.trim()) {
            const q = search.toLowerCase();
            arr = arr.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.categories?.name.toLowerCase().includes(q)
            );
        }

        if (sort === 'az') {
            arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        }

        return arr;
    }, [products, search, sort]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            {/* SubBar fuera del contenedor para que sea ancho completo */}
            <SubBar
                search={search}
                onSearch={v => { setSearch(v); setPage(1); }}
                sort={sort}
                onSort={v => { setSort(v); setPage(1); }}
                total={filtered.length}
            />

            <div className={styles.page}>
                <div className={styles.contentWrapper}>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <h3 className={styles.sidebarTitle}>Categorías</h3>
                        <nav className={styles.categoryList}>
                            {categories.map(cat => (
                                <Link
                                    key={cat.slug}
                                    href={`/flores?category=${cat.slug}`}
                                    className={`${styles.categoryItem} ${currentCategory === cat.slug ? styles.categoryActive : ''}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Grid + paginación */}
                    <main className={styles.mainContent}>
                        {filtered.length === 0 ? (
                            <EmptyState
                                icon="🌷"
                                title="Sin resultados"
                                description="Intenta con otro término de búsqueda."
                            />
                        ) : (
                            <>
                                <div className={styles.grid}>
                                    {paginated.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            categoryName={product.categories?.name}
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <nav className={styles.pagination} aria-label="Paginación">
                                        <button
                                            className={styles.pageBtn}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            ← Anterior
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                            <button
                                                key={n}
                                                className={`${styles.pageBtn} ${page === n ? styles.pageBtnActive : ''}`}
                                                onClick={() => setPage(n)}
                                            >
                                                {n}
                                            </button>
                                        ))}

                                        <button
                                            className={styles.pageBtn}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Siguiente →
                                        </button>
                                    </nav>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
