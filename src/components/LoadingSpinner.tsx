'use client';

import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ text = 'Cargando...' }: { text?: string }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner} />
            <p className={styles.text}>{text}</p>
        </div>
    );
}
