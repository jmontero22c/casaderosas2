import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logEvent } from '@/lib/logger';

// POST /api/stock/update
// Actualizar el stock de un producto.
// Body: { productId: string, quantity: number, operation: 'set' | 'add' | 'subtract' }
export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: request.headers.get('Authorization') || '',
                },
            },
        }
    );

    try {
        const body = await request.json();
        const { productId, quantity, operation } = body;

        if (!productId || typeof quantity !== 'number') {
            return NextResponse.json(
                { error: 'Datos inválidos. Se requiere productId y quantity (number)' },
                { status: 400 }
            );
        }

        // Obtener stock actual
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock, name')
            .eq('id', productId)
            .single();

        if (fetchError || !product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        let newStock = product.stock;
        const currentStock = product.stock;

        switch (operation) {
            case 'add':
                newStock += quantity;
                break;
            case 'subtract':
                newStock -= quantity;
                break;
            case 'set':
            default:
                newStock = quantity;
                break;
        }

        if (newStock < 0) newStock = 0; // Evitar negativos

        // Actualizar en DB
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId);

        if (updateError) throw updateError;

        // Log del evento
        await logEvent('INFO', 'Stock actualizado via API', {
            productId,
            productName: product.name,
            oldStock: currentStock,
            newStock,
            operation,
            change: quantity
        });

        return NextResponse.json({
            success: true,
            productId,
            oldStock: currentStock,
            newStock,
        });
    } catch (err: any) {
        const errorMsg = err.message || 'Error actualizando stock';
        await logEvent('ERROR', 'Fallo crítico al actualizar stock', { error: errorMsg });
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
