-- Ensure event-images bucket exists with proper configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Read Access for Event Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload for Event Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update for Event Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete for Event Images" ON storage.objects;

-- Allow public read access to event images
CREATE POLICY "Public Read Access for Event Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Allow authenticated users to upload event images
CREATE POLICY "Authenticated Upload for Event Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated Update for Event Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to delete event images
CREATE POLICY "Authenticated Delete for Event Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');
