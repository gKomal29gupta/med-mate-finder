-- Create storage bucket for medicine scans
INSERT INTO storage.buckets (id, name, public) VALUES ('medicine-scans', 'medicine-scans', true);

-- Create storage policies for medicine scan uploads
CREATE POLICY "Users can upload their own medicine scans" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medicine-scans' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own medicine scans" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medicine-scans' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own medicine scans" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medicine-scans' AND auth.uid() IS NOT NULL);

-- Make medicine scans publicly accessible for OCR processing
CREATE POLICY "Medicine scans are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medicine-scans');