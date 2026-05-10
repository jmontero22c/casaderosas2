'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './QuoteModal.module.css';

const WA_NUMBER = '573004468890';

interface Props {
    productId: string;
    productName: string;
    productImage: string | null;
    categoryName?: string;
    onClose: () => void;
}

export default function QuoteModal({ productId, productName, productImage, categoryName, onClose }: Props) {
    const productUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/producto/${productId}`
        : '';
    const defaultMsg = `Hola, me gustaría cotizar "${productName}". ¿Está disponible para entrega esta semana?`;
    const [message, setMessage] = useState(defaultMsg);
    const [zone, setZone] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handler);
        };
    }, [onClose]);

    const handleSend = () => {
        let full = zone.trim() ? `${message}\n\nZona: ${zone}` : message;
        if (productUrl) full += `\n\n${productUrl}`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(full)}`, '_blank', 'noreferrer');
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Cotizar arreglo">
            <div className={styles.modal} onClick={e => e.stopPropagation()}>

                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>

                <h2 className={styles.title}>Cotizar este arreglo</h2>
                <p className={styles.subtitle}>
                    Te enviamos a WhatsApp con el mensaje listo. Puedes editarlo antes de enviar.
                </p>

                <div className={styles.productPreview}>
                    <div className={styles.previewImgWrap}>
                        {productImage
                            ? <img src={productImage} alt={productName} className={styles.previewImg} />
                            : <span className={styles.previewPlaceholder}>🌸</span>
                        }
                    </div>
                    <div className={styles.previewInfo}>
                        <span className={styles.previewName}>{productName}</span>
                        {categoryName && <span className={styles.previewCategory}>{categoryName}</span>}
                    </div>
                </div>

                <label className={styles.field}>
                    <span className={styles.label}>Mensaje (opcional)</span>
                    <textarea
                        className={styles.textarea}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={4}
                    />
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>Tu zona / barrio</span>
                    <input
                        type="text"
                        className={styles.input}
                        value={zone}
                        onChange={e => setZone(e.target.value)}
                        placeholder="Ej. Centro, Valledupar"
                    />
                </label>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" className={styles.sendBtn} onClick={handleSend}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                        Enviar por WhatsApp
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
