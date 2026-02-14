
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import styles from './page.module.css';

// Revalidate data periodically
export const revalidate = 3600;

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as Product;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Prepare WhatsApp message
    // Note: We'll construct the URL on the client side ideally, but for SSR we can just use a placeholder
    // or rely on the user copying the link if we can't get the full URL here easily without headers.
    // However, a simpler approach is to use the product ID or name in the text.

    // Better logic: The prompt asked to include the link. 
    // Since we are in a server component, we don't have window.location.
    // We can construct a base URL if we had an env variable, but for now let's just use the product ID info
    // and let the client component handle the exact current URL if needed, OR just hardcode the production domain if known.
    // Given we don't know the deployed domain, we will put the product name and price, and ask the user to share the link or 
    // we can try to construct it if we assume a domain. 
    // Actually, the user requirement "enviar el link del producto" implies we should try to include it.

    // Construct product URL
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const productUrl = `${protocol}://${host}/producto/${product.id}`;

    const phoneNumber = '573004468890';
    const message = `Hola, me gustaría cotizar este producto:
    
Nombre: ${product.name}
Precio: ${formatPrice(product.price)}
Link: ${productUrl}

¿Está disponible?`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <div className={styles.container}>
            <div className={styles.productWrapper}>
                <div className={styles.imageContainer}>
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

                <div className={styles.details}>
                    <Link href="/" className={styles.backLink}>
                        ← Volver al inicio
                    </Link>

                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.price}>
                        {formatPrice(product.price)}
                    </div>

                    <div className={styles.stockStatus}>
                        {product.stock > 0 ? (
                            <span className={styles.inStock}>Disponible</span>
                        ) : (
                            <span className={styles.outOfStock}>Agotado</span>
                        )}
                    </div>

                    <div className={styles.descriptionContainer}>
                        <h3 className={styles.descriptionTitle}>Descripción</h3>
                        <p className={styles.description}>
                            {product.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.quoteButton}
                        >
                            <span>💬</span> Cotizar en WhatsApp
                        </a>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                            (Se abrirá un chat con la información del producto)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
