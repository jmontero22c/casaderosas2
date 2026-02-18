'use client';

import { useEffect, useState } from 'react';
import styles from './FallingPetals.module.css';

interface Petal {
    id: number;
    left: string;
    animationDuration: string;
    animationDelay: string;
    scale: number;
    rotation: number;
}

export default function FallingPetals() {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        const petalCount = 15;
        const newPetals: Petal[] = [];

        for (let i = 0; i < petalCount; i++) {
            newPetals.push({
                id: i,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 8 + 10}s`, // 6-14s
                animationDelay: `${Math.random() * 12}s`,
                scale: Math.random() * 1.6 + 5.4,
                rotation: Math.random() * 360,
            });
        }

        setPetals(newPetals);
    }, []);

    return (
        <div className={styles.container}>
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    className={styles.petal}
                    style={{
                        left: petal.left,
                        animationDuration: petal.animationDuration,
                        animationDelay: petal.animationDelay,
                        transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}
