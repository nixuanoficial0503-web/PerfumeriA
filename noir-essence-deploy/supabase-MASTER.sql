-- ═══════════════════════════════════════════════════════════════
-- NOIR·ESSENCE — MASTER SCHEMA (todas las fases)
-- Ejecutar completo en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- NOIR·ESSENCE — Database Schema
-- Ejecutar en Supabase SQL Editor en este orden exacto
-- ═══════════════════════════════════════════════════════════════

-- 1. PROFILES (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tagline TEXT,
  concentration TEXT CHECK (concentration IN ('EDC', 'EDT', 'EDP', 'Parfum')),
  gender TEXT CHECK (gender IN ('masculino', 'femenino', 'unisex')),
  olfactory_family TEXT,
  notes_top TEXT[] DEFAULT '{}',
  notes_heart TEXT[] DEFAULT '{}',
  notes_base TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size_ml INTEGER NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),  -- centavos COP
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  sku TEXT UNIQUE,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size_ml)
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending','paid','processing','shipped','delivered','cancelled')
  ),
  total INTEGER NOT NULL CHECK (total >= 0),  -- centavos COP
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  shipping_address JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price > 0),  -- centavos COP
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- 8. WISHLIST
CREATE TABLE IF NOT EXISTS wishlist (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- 9. DISCOUNT CODES
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('percentage', 'fixed')) NOT NULL,
  value INTEGER NOT NULL,  -- porcentaje (0-100) o centavos fijos
  min_order INTEGER DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES (performance)
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS needed for reads)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Brands: public read, admin write
CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_admin_write" ON brands FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products: public read active, admin write
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Product variants: public read, admin write
CREATE POLICY "variants_public_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_admin_write" ON product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: users see own, admins see all
CREATE POLICY "profiles_own_read" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: users see own, admins see all
CREATE POLICY "orders_own_read" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_own_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items: through orders
CREATE POLICY "order_items_own" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "order_items_admin" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Wishlist: users manage own
CREATE POLICY "wishlist_own" ON wishlist USING (auth.uid() = user_id);

-- Reviews: public read, auth users insert own
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA (productos de prueba)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO brands (name, slug, country) VALUES
  ('Maison Noir', 'maison-noir', 'Francia'),
  ('Atelier Bloom', 'atelier-bloom', 'Francia'),
  ('Dark Forest', 'dark-forest', 'Alemania'),
  ('Lumière', 'lumiere', 'Italia')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (brand_id, name, slug, tagline, concentration, gender, olfactory_family, notes_top, notes_heart, notes_base, is_featured)
SELECT
  b.id,
  'Oud Absolu',
  'oud-absolu',
  'Una oda a las noches árabes',
  'EDP',
  'unisex',
  'Orientales',
  ARRAY['Bergamota', 'Pimienta negra'],
  ARRAY['Oud', 'Rosa de Damasco', 'Geranio'],
  ARRAY['Vainilla', 'Ámbar gris', 'Musk blanco'],
  true
FROM brands b WHERE b.slug = 'maison-noir'
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- NOIR·ESSENCE — Fase 3 SQL additions
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Function to safely decrement stock (avoids going negative)
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE product_variants
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (called from webhook with service role)
GRANT EXECUTE ON FUNCTION decrement_stock TO service_role;

-- Orders: allow inserting for authenticated and anonymous users
CREATE POLICY IF NOT EXISTS "orders_anon_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items: allow inserting
CREATE POLICY IF NOT EXISTS "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- Index for faster wishlist lookups
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id);

-- Index for stripe session lookup
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- NOIR·ESSENCE — Fase 4 SQL additions
-- ═══════════════════════════════════════════════════════════════

-- Allow admin to read all profiles
CREATE POLICY IF NOT EXISTS "admin_read_all_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Discount codes: public validation read, admin write
CREATE POLICY IF NOT EXISTS "discounts_public_read" ON discount_codes
  FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "discounts_admin_write" ON discount_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Increment uses when discount is applied
CREATE OR REPLACE FUNCTION use_discount_code(p_code TEXT)
RETURNS TABLE(valid BOOLEAN, discount_type TEXT, discount_value INTEGER) AS $$
DECLARE
  v_code discount_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_code FROM discount_codes
  WHERE code = UPPER(p_code) AND is_active = TRUE
    AND (max_uses IS NULL OR uses_count < max_uses)
    AND (expires_at IS NULL OR expires_at > NOW());

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::INTEGER;
    RETURN;
  END IF;

  UPDATE discount_codes SET uses_count = uses_count + 1 WHERE id = v_code.id;

  RETURN QUERY SELECT TRUE, v_code.type, v_code.value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full text search on products
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description,'') || ' ' || COALESCE(olfactory_family,'')));

-- Promote first user to admin (run once manually)
-- UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
