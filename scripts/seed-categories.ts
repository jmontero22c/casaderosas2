
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const flowerCategories = [
    { name: 'Tradicionales', slug: 'tradicionales' },
    { name: 'Arreglos Redondos', slug: 'arreglos-redondos' },
    { name: 'Bouquet', slug: 'bouquet' },
    { name: 'Funebres', slug: 'funebres' },
    { name: 'Artificiales', slug: 'artificiales' },
    { name: 'Boda', slug: 'boda' },
    { name: 'Decoracion Iglesia', slug: 'decoracion-iglesia' },
    { name: 'Primera comunion', slug: 'primera-comunion' },
];

async function seed() {
    console.log('Seeding flower categories...');

    for (const cat of flowerCategories) {
        const { data, error } = await supabase
            .from('categories')
            .upsert(cat, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error(`Error seeding ${cat.name}:`, error.message);
        } else {
            console.log(`Successfully seeded: ${cat.name}`);
        }
    }
}

seed();
