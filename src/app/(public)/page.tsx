import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import ProductStrip from '@/components/ProductStrip';
import styles from './page.module.css';
import Image from 'next/image';
import FallingPetals from '@/components/FallingPetals';
import BannerSlider from '@/components/BannerSlider';

export const dynamic = 'force-dynamic';

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
      getProductsByCategory('tradicionales'),
      getProductsByCategory('anchetas'),
    ]);
  } catch (e) {
    error = 'No se pudieron cargar los productos. Intenta de nuevo más tarde.';
    console.error(e);
  }

  return (
    <>
      <FallingPetals />
      <section className={styles.hero}>
        <div className={styles.heroDecorationLeft}>
          <Image
            src="/flores-izq.png"
            alt="Decoración floral izquierda"
            width={300}
            height={500}
            className={styles.sideDecoration}
            priority
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroImage}>
            <Image
              src="/Logo.png"
              alt="Hero"
              width={400}
              height={400}
            />
          </div>

          <div className={styles.heroTitle}>
            <span className={styles.heroAccent}>Casa de Rosas</span>
            <p className={styles.heroSubtitle}>
              FLORES, ARTE & CREACIONES
              <br />
              Creaciones hechas con amor para cada ocasión 💛
            </p>
            <div className={styles.divider} />
          </div>
        </div>
      </section>

      {error && <div className={styles.errorBox}>{error}</div>}

      <BannerSlider />

      <ProductStrip
        title="Arreglos Florales"
        products={flores}
        viewAllHref="/flores"
        id="flores"
      />

      <ProductStrip
        title="Anchetas"
        products={anchetas}
        viewAllHref="/anchetas"
        id="detallitos"
      />
    </>
  );
}
