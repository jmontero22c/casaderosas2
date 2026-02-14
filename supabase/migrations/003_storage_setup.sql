-- ============================================
-- Casa de Rosas — Fase 4: Storage Setup
-- ============================================

-- 1. Crear bucket 'products' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Seguridad (RLS) para 'products'

-- Permitir acceso público para ver imágenes (SELECT)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'products' );

-- Permitir subir imágenes solo a usuarios autenticados (INSERT)
CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'products' );

-- Permitir actualizar/eliminar solo a usuarios autenticados
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'products' );

CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'products' );
