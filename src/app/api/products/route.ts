import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logEvent } from '@/lib/logger';

// Helper para crear cliente con contexto de la request (auth headers)
function getSupabaseClient(request: NextRequest) {
    return createClient(
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
}

// GET /api/products
// Listar productos. Query params: category (slug), active (true/false)
export async function GET(request: NextRequest) {
    const supabase = getSupabaseClient(request);
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const active = searchParams.get('active');

    try {
        let query = supabase.from('products').select('*, categories!inner(slug)');

        if (categorySlug) {
            query = query.eq('categories.slug', categorySlug);
        }
        if (active === 'true') {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        const errorMsg = err.message || 'Error fetching products';
        console.error(errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}

// POST /api/products
// Crear nuevo producto
export async function POST(request: NextRequest) {
    const supabase = getSupabaseClient(request);
    try {
        const body = await request.json();
        const { name, price, category_id, stock } = body;

        // Validación básica
        if (!name || !price || !category_id) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios (name, price, category_id)' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('products')
            .insert(body)
            .select()
            .single();

        if (error) throw error;

        await logEvent('INFO', 'Producto creado via API', { productId: data.id, name });

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        const errorMsg = err.message || 'Error creando producto';
        await logEvent('ERROR', 'Fallo al crear producto API', { error: errorMsg });
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}

// PUT /api/products
// Actualizar producto. Requiere 'id' en el body.
export async function PUT(request: NextRequest) {
    const supabase = getSupabaseClient(request);
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido para actualizar' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await logEvent('INFO', 'Producto actualizado via API', { productId: id, updates });

        return NextResponse.json(data);
    } catch (err: any) {
        const errorMsg = err.message || 'Error actualizando producto';
        await logEvent('ERROR', 'Fallo al actualizar producto API', { error: errorMsg });
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}

// DELETE /api/products
// Eliminar producto. Requiere 'id' en query param.
export async function DELETE(request: NextRequest) {
    const supabase = getSupabaseClient(request);
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID es requerido (query param)' }, { status: 400 });
    }

    try {
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) throw error;

        await logEvent('WARN', 'Producto eliminado via API', { productId: id });

        return NextResponse.json({ success: true, message: 'Producto eliminado' });
    } catch (err: any) {
        const errorMsg = err.message || 'Error eliminando producto';
        await logEvent('ERROR', 'Fallo al eliminar producto API', { error: errorMsg, productId: id });
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
