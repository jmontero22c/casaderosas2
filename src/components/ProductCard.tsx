import { Product } from '@/types/database';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
    onClick?: () => void;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageWrapper}>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholder}>🌸</div>
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>{formatPrice(product.price)}</p>
                {product.stock <= 0 && (
                    <p className={styles.outOfStock}>Agotado</p>
                )}
            </div>
        </div>
    );
}
