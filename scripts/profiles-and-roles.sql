-- Kör i Supabase SQL Editor.
-- Skapar profiles med roll (kopplat till auth.users). Ingen articles-tabell här.

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  display_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profil skapas automatiskt när någon registreras
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS: användare kan läsa sin egen profil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile (limited)"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin kan uppdatera roller (kräver att du senare lägger till policy för role = 'admin' eller använder service_role i backend)
-- Här kan du manuellt sätta första användaren till admin i Table Editor:
-- UPDATE profiles SET role = 'admin' WHERE id = '<din-user-uuid>';
