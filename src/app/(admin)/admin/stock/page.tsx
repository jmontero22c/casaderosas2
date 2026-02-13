'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import styles from './page.module.css';

interface StockEntry {
    product: Product;
    newStock: string;
}

export default function StockPage() {
    const [entries, setEntries] = useState<StockEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('name');

            if (data) {
                setEntries(
                    (data as Product[]).map((p) => ({
                        product: p,
                        newStock: String(p.stock),
                    }))
                );
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateStock = async (id: string, stock: number) => {
        await supabase.from('products').update({ stock }).eq('id', id);
        setSuccessMsg('Stock actualizado correctamente.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchProducts();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className={styles.pageTitle}>Control de Stock</h1>

            {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

            {entries.length === 0 ? (
                <EmptyState
                    icon="📋"
                    title="Sin productos"
                    description="Agrega productos primero para gestionar el stock."
                />
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Stock actual</th>
                                <th>Nuevo stock</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, i) => (
                                <tr key={entry.product.id}>
                                    <td className={styles.productName}>{entry.product.name}</td>
                                    <td>
                                        <span
                                            className={
                                                entry.product.stock <= 3 ? styles.stockLow : styles.stockOk
                                            }
                                        >
                                            {entry.product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.stockInput}
                                            value={entry.newStock}
                                            min="0"
                                            onChange={(e) => {
                                                const updated = [...entries];
                                                updated[i] = { ...entry, newStock: e.target.value };
                                                setEntries(updated);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className={styles.updateBtn}
                                            disabled={String(entry.product.stock) === entry.newStock}
                                            onClick={() =>
                                                updateStock(entry.product.id, parseInt(entry.newStock))
                                            }
                                        >
                                            Actualizar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
