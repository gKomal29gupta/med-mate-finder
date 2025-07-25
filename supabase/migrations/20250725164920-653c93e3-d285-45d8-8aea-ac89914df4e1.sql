-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  medical_conditions TEXT[],
  allergies TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "reminder": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create medicine_scans table for scan history
CREATE TABLE public.medicine_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  extracted_text TEXT,
  detected_medicine_name TEXT,
  confidence_score DECIMAL(3,2),
  generic_suggestions JSONB,
  price_savings DECIMAL(10,2),
  scan_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicine_searches table for search history
CREATE TABLE public.medicine_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  medicine_found JSONB,
  generic_alternatives JSONB,
  search_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'twice_daily', 'weekly', etc.
  specific_times TIME[],
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  reminder_type TEXT DEFAULT 'medication', -- 'medication', 'appointment', 'refill'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reminder_logs table for tracking adherence
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'taken', 'missed', 'skipped'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicine_favorites table
CREATE TABLE public.medicine_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  medicine_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, medicine_name)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for medicine_scans
CREATE POLICY "Users can view their own scans" 
ON public.medicine_scans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans" 
ON public.medicine_scans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans" 
ON public.medicine_scans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" 
ON public.medicine_scans FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for medicine_searches
CREATE POLICY "Users can view their own searches" 
ON public.medicine_searches FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own searches" 
ON public.medicine_searches FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches" 
ON public.medicine_searches FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own searches" 
ON public.medicine_searches FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for reminders
CREATE POLICY "Users can view their own reminders" 
ON public.reminders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.reminders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for reminder_logs
CREATE POLICY "Users can view their own reminder logs" 
ON public.reminder_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminder logs" 
ON public.reminder_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder logs" 
ON public.reminder_logs FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for medicine_favorites
CREATE POLICY "Users can view their own favorites" 
ON public.medicine_favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.medicine_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.medicine_favorites FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for medicine images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medicine-images', 'medicine-images', true);

-- Create storage policies for medicine images
CREATE POLICY "Users can view medicine images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'medicine-images');

CREATE POLICY "Users can upload medicine images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'medicine-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own medicine images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'medicine-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own medicine images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'medicine-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);