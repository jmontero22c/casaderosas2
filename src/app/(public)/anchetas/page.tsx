import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import styles from '../catalog.module.css';

export const metadata = {
    title: 'Anchetas — Casa de Rosas',
    description: 'Explora nuestra colección de anchetas y cestas de regalo.',
};

async function getAnchetas(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories!inner(slug)')
        .eq('categories.slug', 'anchetas')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as Product[]) || [];
}

export default async function AnchetasPage() {
    let products: Product[] = [];
    let error: string | null = null;

    try {
        products = await getAnchetas();
    } catch (e) {
        error = 'No se pudieron cargar los productos.';
        console.error(e);
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>🎁 Anchetas</h1>
                <p className={styles.subtitle}>
                    Cestas de regalo y detalles especiales para sorprender.
                </p>
            </div>

            {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}

            {products.length === 0 && !error ? (
                <EmptyState
                    icon="🎀"
                    title="No hay anchetas disponibles"
                    description="Pronto agregaremos más productos."
                />
            ) : (
                <div className={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
