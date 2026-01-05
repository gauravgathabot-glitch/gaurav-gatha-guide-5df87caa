-- Create storage bucket for knowledge resources
INSERT INTO storage.buckets (id, name, public) VALUES ('knowledge-files', 'knowledge-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for knowledge files
CREATE POLICY "Anyone can view knowledge files"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-files');

CREATE POLICY "Admins can upload knowledge files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete knowledge files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  )
);