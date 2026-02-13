// Tipos TypeScript para el schema de Supabase — Casa de Rosas

export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    is_active: boolean;
    category_id: string;
    created_at: string;
    updated_at: string;
}

// Product con la categoría expandida (para JOINs)
export interface ProductWithCategory extends Product {
    category: Category;
}
