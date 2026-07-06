ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS whatsapp_group3_unlocked BOOLEAN DEFAULT true;

UPDATE app_settings
  SET whatsapp_group2_unlocked = false
  WHERE setting_key = 'global';
