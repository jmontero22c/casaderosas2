'use client';

import { useState } from 'react';
import ImageModal from './ImageModal';
import styles from './ProductCard.module.css'; // Reusing some styles if needed, or define local ones

interface ProductImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={className}
                onClick={() => setShowModal(true)}
                style={{ cursor: 'zoom-in' }}
            />
            {showModal && (
                <ImageModal
                    imageUrl={src}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
