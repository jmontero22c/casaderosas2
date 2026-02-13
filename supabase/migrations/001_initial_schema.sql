-- ============================================
-- Casa de Rosas — Fase 1: Schema Inicial
-- ============================================

-- -------------------------
-- 1. Tabla: categories
-- -------------------------
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 2. Tabla: products
-- -------------------------
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------
-- 3. Índices
-- -------------------------
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(is_active);

-- -------------------------
-- 4. Trigger: auto-actualizar updated_at
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. Row Level Security (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

-- categories: lectura pública
CREATE POLICY "categories_select_all"
  ON categories FOR SELECT
  USING (true);

-- categories: escritura solo autenticados
CREATE POLICY "categories_insert_auth"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_update_auth"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_delete_auth"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- products: lectura pública
CREATE POLICY "products_select_all"
  ON products FOR SELECT
  USING (true);

-- products: escritura solo autenticados
CREATE POLICY "products_insert_auth"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_update_auth"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_delete_auth"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. Datos de ejemplo (seed)
-- ============================================

-- Categorías
INSERT INTO categories (id, name, slug) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Flores',   'flores'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Anchetas', 'anchetas');

-- Productos: Flores
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  (
    'Ramo de Rosas Rojas',
    'Elegante ramo de 12 rosas rojas frescas con follaje decorativo.',
    85000.00, 10, NULL,
    'a1b2c3d4-0001-4000-8000-000000000001'
  ),
  (
    'Bouquet Primaveral',
    'Mezcla colorida de margaritas, girasoles y lirios.',
    65000.00, 8, NULL,
    'a1b2c3d4-0001-4000-8000-000000000001'
  ),
  (
    'Arreglo de Orquídeas',
    'Orquídea phalaenopsis en maceta decorativa de cerámica.',
    120000.00, 5, NULL,
    'a1b2c3d4-0001-4000-8000-000000000001'
  );

-- Productos: Anchetas
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  (
    'Ancheta Romántica',
    'Caja con chocolates, vino tinto, velas aromáticas y tarjeta personalizada.',
    150000.00, 6, NULL,
    'a1b2c3d4-0002-4000-8000-000000000002'
  ),
  (
    'Ancheta Dulce Sorpresa',
    'Canasta con galletas artesanales, brownies, gomitas y bebida.',
    95000.00, 12, NULL,
    'a1b2c3d4-0002-4000-8000-000000000002'
  ),
  (
    'Ancheta Premium',
    'Set de lujo con quesos importados, jamón serrano, aceitunas y vino blanco.',
    220000.00, 4, NULL,
    'a1b2c3d4-0002-4000-8000-000000000002'
  );
