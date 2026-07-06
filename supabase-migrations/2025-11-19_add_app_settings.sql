-- Create app_settings table for global app configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  whatsapp_group_unlocked BOOLEAN DEFAULT false,
  setting_key TEXT UNIQUE NOT NULL DEFAULT 'global'
);

-- Insert default settings
INSERT INTO app_settings (setting_key, whatsapp_group_unlocked)
VALUES ('global', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings (for community form)
CREATE POLICY "Allow public to read settings" ON app_settings
  FOR SELECT USING (true);

-- Allow all operations for now (you can restrict this to admin users later)
CREATE POLICY "Allow all for app_settings" ON app_settings
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
