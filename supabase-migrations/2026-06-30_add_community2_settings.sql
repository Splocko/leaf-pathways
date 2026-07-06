ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS whatsapp_group2_unlocked BOOLEAN DEFAULT true;
