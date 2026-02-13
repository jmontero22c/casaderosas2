import Link from 'next/link';
import { Product } from '@/types/database';
import ProductCard from './ProductCard';
import styles from './ProductStrip.module.css';

interface ProductStripProps {
    title: string;
    products: Product[];
    viewAllHref: string;
}

export default function ProductStrip({ title, products, viewAllHref }: ProductStripProps) {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                <Link href={viewAllHref} className={styles.viewAll}>
                    Ver todos →
                </Link>
            </div>
            <div className={styles.strip}>
                {products.map((product) => (
                    <div key={product.id} className={styles.cardWrapper}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
