'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './BannerSlider.module.css';

interface Banner {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    color: string;
}

const BANNERS: Banner[] = [
    {
        id: 1,
        image: '/banner-1.png',
        title: 'Temporada de San Valentín',
        subtitle: 'Expresa tu amor con las mejores rosas rojas',
        color: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
    },
    {
        id: 2,
        image: '/banner-2.png',
        title: 'Anchetas Premium',
        subtitle: 'El detalle perfecto para celebrar un cumpleaños',
        color: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
    },
    {
        id: 3,
        image: 'banner-3.png',
        title: 'Detalles Personalizados',
        subtitle: 'Creamos momentos únicos con mucho amor',
        color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    }
];

export default function BannerSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused]);

    return (
        <div
            className={styles.sliderWrapper}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={styles.sliderContainer}>
                <div
                    className={styles.slideTrack}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {BANNERS.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                            onClick={() => index !== currentIndex && setCurrentIndex(index)}
                            style={{ cursor: index !== currentIndex ? 'pointer' : 'default' }}
                        >
                            {banner.image.length > 0 &&
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className={styles.slideImage}
                                />}
                            <div
                            >
                                <div className={styles.slideContent}>
                                    <p className={styles.slideSubtitle}>{banner.subtitle}</p>
                                </div>
                            </div>
                            <div className={styles.slideShadow} />
                        </div>
                    ))}
                </div>

                <div className={styles.controls}>
                    {BANNERS.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
