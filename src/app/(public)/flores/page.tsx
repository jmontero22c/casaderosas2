import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import styles from '../catalog.module.css';
import Link from 'next/link';

export const metadata = {
    title: 'Flores — Casa de Rosas',
    description: 'Explora nuestra colección de arreglos florales.',
};

async function getFlores(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories!inner(slug)')
        .eq('categories.slug', 'flores')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as Product[]) || [];
}

export default async function FloresPage() {
    let products: Product[] = [];
    let error: string | null = null;

    try {
        products = await getFlores();
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

            {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}

            {products.length === 0 && !error ? (
                <EmptyState
                    icon="🌷"
                    title="No hay flores disponibles"
                    description="Pronto agregaremos más productos."
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
        </div>
    );
}
