import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import AnchetasContent from './AnchetasContent';


export const metadata = {
    title: 'Anchetas — Casa de Rosas',
    description: 'Explora nuestra colección de anchetas y cestas de regalo.',
};

export const dynamic = 'force-dynamic';

async function getAnchetas(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, categories!inner(slug)')
        .eq('categories.slug', 'anchetas')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as Product[]) || [];
}

export default async function AnchetasPage() {
    let products: Awaited<ReturnType<typeof getAnchetas>> = [];

    try {
        products = await getAnchetas();
    } catch (e) {
        console.error(e);
    }

    return (
        <AnchetasContent products={products as any}/>
    );
}
