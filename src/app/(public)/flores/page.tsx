import { supabase } from '@/lib/supabase/client';
import FloresContent from './FloresContent';

const flowerCategories = [
    { name: 'Todas', slug: 'flores' },
    { name: 'Tradicionales', slug: 'tradicionales' },
    { name: 'Arreglos Redondos', slug: 'arreglos-redondos' },
    { name: 'Bouquet', slug: 'bouquet' },
    { name: 'Funebres', slug: 'funebres' },
    { name: 'Artificiales', slug: 'artificiales' },
    { name: 'Boda', slug: 'boda' },
    { name: 'Decoracion Iglesia', slug: 'decoracion-iglesia' },
    { name: 'Primera comunion', slug: 'primera-comunion' },
];

export const metadata = {
    title: 'Flores — Casa de Rosas',
    description: 'Explora nuestra colección de arreglos florales.',
};

export const dynamic = 'force-dynamic';

async function getFlores(categorySlug: string) {
    let query = supabase
        .from('products')
        .select('*, categories!inner(name, slug)')
        .eq('is_active', true);

    if (categorySlug === 'flores') {
        const slugs = flowerCategories.map(c => c.slug);
        query = query.in('categories.slug', slugs);
    } else {
        query = query.eq('categories.slug', categorySlug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

interface FloresPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function FloresPage({ searchParams }: FloresPageProps) {
    const { category } = await searchParams;
    const currentCategory = category || 'flores';

    let products: Awaited<ReturnType<typeof getFlores>> = [];

    try {
        products = await getFlores(currentCategory);
    } catch (e) {
        console.error(e);
    }

    return (
        <FloresContent
            products={products as any}
            categories={flowerCategories}
            currentCategory={currentCategory}
        />
    );
}
