-- ============================================
-- Casa de Rosas — Fase 3: Logging System
-- ============================================

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Solo permitir lectura al service_role o admins (si hubiera roles definidos)
-- Por ahora, bloqueamos todo acceso público
CREATE POLICY "Enable insert for authenticated users only"
ON system_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users only"
ON system_logs FOR SELECT
TO authenticated
USING (true);
