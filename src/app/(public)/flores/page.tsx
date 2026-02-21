import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import styles from '../catalog.module.css';
import Link from 'next/link';
import { headers } from 'next/headers';

const flowerCategories = [
    { name: 'Todas', slug: 'flores' },
    { name: 'Tradicionales', slug: 'tradicionales' },
    { name: 'Arreglos Redondos', slug: 'arreglos-redondos' },
    { name: 'Bouquet', slug: 'bouquet' },
    { name: 'Funebres', slug: 'funebres' },
    { name: 'Artificiales', slug: 'artificiales' },
    { name: 'Boda', slug: 'boda' },
    { name: 'Decoracion Iglesia', slug: 'decoracion-iglesia' },
    { name: 'Primera comunion', slug: 'primera-comunion' },
];

export const metadata = {
    title: 'Flores — Casa de Rosas',
    description: 'Explora nuestra colección de arreglos florales.',
};

export const dynamic = 'force-dynamic';

async function getFlores(categorySlug: string): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select('*, categories!inner(slug)')
        .eq('is_active', true);

    if (categorySlug === 'flores') {
        const slugs = flowerCategories.map(c => c.slug);
        query = query.in('categories.slug', slugs);
    } else {
        query = query.eq('categories.slug', categorySlug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as Product[]) || [];
}

interface FloresPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function FloresPage({ searchParams }: FloresPageProps) {
    const { category } = await searchParams;
    const currentCategory = category || 'flores';

    let products: Product[] = [];
    let error: string | null = null;

    try {
        products = await getFlores(currentCategory);
    } catch (e) {
        error = 'No se pudieron cargar los productos.';
        console.error(e);
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>🌸 Arreglos Florales</h1>
                <p className={styles.subtitle}>
                    Encuentra el arreglo perfecto para cada ocasión.
                </p>
            </div>

            <div className={styles.contentWrapper}>
                <aside className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Categorías</h3>
                    <nav className={styles.categoryList}>
                        {flowerCategories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/flores?category=${cat.slug}`}
                                className={`${styles.categoryItem} ${currentCategory === cat.slug ? styles.categoryActive : ''
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className={styles.mainContent}>
                    {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}

                    {products.length === 0 && !error ? (
                        <EmptyState
                            icon="🌷"
                            title="No hay flores disponibles"
                            description="Pronto agregaremos más productos en esta categoría."
                        />
                    ) : (
                        <div className={styles.grid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.cardWrapper}>
                                    <Link href={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <ProductCard product={product} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
