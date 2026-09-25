-- Add mission and vision columns to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS mission text DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS vision text DEFAULT '';
