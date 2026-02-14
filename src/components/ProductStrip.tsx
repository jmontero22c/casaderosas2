'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import ProductCard from './ProductCard';
import styles from './ProductStrip.module.css';

interface ProductStripProps {
    title: string;
    products: Product[];
    viewAllHref: string;
    id?: string;
}

export default function ProductStrip({ title, products, viewAllHref, id }: ProductStripProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Adjust scroll amount as needed
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id={id} className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>{title}</h2>
                <Link href={viewAllHref} className={styles.viewAll}>
                    Ver todos →
                </Link>
            </div>

            <div className={styles.stripContainer}>
                <button
                    className={`${styles.scrollButton} ${styles.scrollLeft}`}
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z" /></g></svg>
                </button>

                <div className={styles.strip} ref={scrollContainerRef}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.cardWrapper}>
                            <Link href={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ProductCard product={product} />
                            </Link>
                        </div>
                    ))}
                </div>

                <button
                    className={`${styles.scrollButton} ${styles.scrollRight}`}
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z" /></g></svg>
                </button>
            </div>
        </section>
    );
}
