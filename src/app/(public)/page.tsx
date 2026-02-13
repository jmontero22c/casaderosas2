import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductStrip from '@/components/ProductStrip';
import styles from './page.module.css';

async function getProductsByCategory(slug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug)')
    .eq('categories.slug', slug)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as Product[]) || [];
}

export default async function HomePage() {
  let flores: Product[] = [];
  let anchetas: Product[] = [];
  let error: string | null = null;

  try {
    [flores, anchetas] = await Promise.all([
      getProductsByCategory('flores'),
      getProductsByCategory('anchetas'),
    ]);
  } catch (e) {
    error = 'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
    console.error(e);
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroAccent}>Casa de Rosas</span>
          </h1>
          <p className={styles.heroSubtitle}>
            <span className={styles.heroEmoji}>🌸</span> Flores | Anchetas | Detalles
            <br />
            Creaciones hechas con amor para cada ocasión 💛
          </p>
          <div className={styles.divider} />
        </div>
      </section>

      {error && <div className={styles.errorBox}>{error}</div>}

      <ProductStrip
        title="Arreglos Florales"
        products={flores}
        viewAllHref="/flores"
      />

      <ProductStrip
        title="Anchetas"
        products={anchetas}
        viewAllHref="/anchetas"
      />
    </>
  );
}
