'use client';

import styles from './SubBar.module.css';

interface SubBarProps {
    search: string;
    onSearch: (v: string) => void;
    sort: 'recientes' | 'az';
    onSort: (v: 'recientes' | 'az') => void;
    total: number;
}

export default function SubBar({ search, onSearch, sort, onSort, total }: SubBarProps) {
    return (
        <div className={styles.subbar}>
            <div className={styles.inner}>
                <span className={styles.count}>{total} arreglos</span>

                <label className={styles.search}>
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar arreglos, ocasiones, colores…"
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                    />
                </label>

                <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => onSort(sort === 'recientes' ? 'az' : 'recientes')}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                        <path d="M3 6h18M7 12h10M11 18h2" />
                    </svg>
                    {sort === 'recientes' ? 'Recientes' : 'A – Z'}
                </button>
            </div>
        </div>
    );
}
