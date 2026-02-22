'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { uploadProductImage } from '@/lib/supabase/storage';
import { Product, Category } from '@/types/database';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ImageModal from '@/components/ImageModal';
import styles from './page.module.css';

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(price);
}

interface ProductForm {
    name: string;
    description: string;
    price: string;
    stock: string;
    // image_url se maneja separado o se actualiza tras subida
    category_id: string;
    is_active: boolean;
}

const emptyForm: ProductForm = {
    name: '',
    description: '',
    price: '75000',
    stock: '1',
    category_id: '',
    is_active: true,
};

export default function ProductosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);

    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('categories').select('*'),
            ]);
            if (prodRes.data) setProducts(prodRes.data as Product[]);
            if (catRes.data) setCategories(catRes.data as Category[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm, category_id: categories[0]?.id || '' });
        setCurrentImageUrl('');
        setImageFile(null);
        setShowModal(true);
    };

    const openEdit = (product: Product) => {
        setEditingId(product.id);
        setForm({
            name: product.name,
            description: product.description || '',
            price: String(product.price),
            stock: String(product.stock),
            category_id: product.category_id,
            is_active: product.is_active,
        });
        setCurrentImageUrl(product.image_url || '');
        setImageFile(null);
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Preview local
            setCurrentImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setUploading(!!imageFile);

        try {
            let finalImageUrl = currentImageUrl;

            if (imageFile) {
                const url = await uploadProductImage(imageFile);
                if (url) {
                    finalImageUrl = url;
                } else {
                    alert('Error al subir la imagen. Se guardará sin actualizar imagen.');
                }
            }

            const payload = {
                name: form.name,
                description: form.description || null,
                price: parseFloat(form.price),
                stock: parseInt(form.stock),
                image_url: finalImageUrl || null, // Usar la nueva URL o la existente
                category_id: form.category_id,
                is_active: form.is_active,
            };

            if (editingId) {
                await supabase.from('products').update(payload).eq('id', editingId);
            } else {
                await supabase.from('products').insert(payload);
            }
            setShowModal(false);
            fetchData();
        } catch (e) {
            console.error(e);
            alert('Error guardando producto');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este producto?')) return;
        await supabase.from('products').delete().eq('id', id);
        fetchData();
    };

    const getCategoryName = (catId: string) =>
        categories.find((c) => c.id === catId)?.name || '—';

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Productos</h1>
                <button className={styles.addBtn} onClick={openCreate}>
                    + Agregar producto
                </button>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No hay productos"
                    description="Agrega tu primer producto para empezar."
                />
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                width={40}
                                                height={40}
                                                style={{ borderRadius: 4, objectFit: 'cover', cursor: 'pointer' }}
                                                onClick={() => setViewingImageUrl(p.image_url)}
                                            />
                                        ) : (
                                            <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
                                        )}
                                    </td>
                                    <td className={styles.productName}>{p.name}</td>
                                    <td>{getCategoryName(p.category_id)}</td>
                                    <td className={styles.priceCell}>{formatPrice(p.price)}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <span
                                            className={`${styles.badge} ${p.is_active ? styles.badgeActive : styles.badgeInactive
                                                }`}
                                        >
                                            {p.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.editBtn}`}
                                                onClick={() => openEdit(p)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>
                            {editingId ? 'Editar producto' : 'Nuevo producto'}
                        </h2>

                        <div className={styles.formGroup}>
                            <label>Imagen</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                {currentImageUrl && (
                                    <img src={currentImageUrl} alt="Preview" width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #ddd' }} />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nombre</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Ej: Ramo de Rosas Rojas"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descripción</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Descripción del producto..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Categoría</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Precio (COP)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                min="0"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Stock</label>
                            <input
                                type="number"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                min="0"
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={saving || !form.name || !form.price}
                            >
                                {saving ? (uploading ? 'Subiendo imagen...' : 'Guardando...') : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewingImageUrl && (
                <ImageModal
                    imageUrl={viewingImageUrl}
                    onClose={() => setViewingImageUrl(null)}
                />
            )}
        </div>
    );
}
