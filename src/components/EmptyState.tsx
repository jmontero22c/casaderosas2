import styles from './EmptyState.module.css';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
}

export default function EmptyState({
    icon = '📦',
    title,
    description,
}: EmptyStateProps) {
    return (
        <div className={styles.wrapper}>
            <span className={styles.icon}>{icon}</span>
            <h3 className={styles.title}>{title}</h3>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}
