-- Create knowledge_resources table for admin-uploaded content
CREATE TABLE public.knowledge_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('army_history', 'heritage_sites', 'hotels', 'shops', 'restaurants', 'emergency', 'general')),
  media_type TEXT CHECK (media_type IN ('text', 'image', 'video', 'audio', 'pdf')),
  media_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_sessions table to track conversations
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Knowledge resources: Anyone can read active resources
CREATE POLICY "Anyone can view active knowledge resources"
ON public.knowledge_resources FOR SELECT
USING (is_active = true);

-- Admins can manage knowledge resources
CREATE POLICY "Admins can manage knowledge resources"
ON public.knowledge_resources FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Chat sessions: Users can view and create their own sessions
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions FOR SELECT
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can create chat sessions"
ON public.chat_sessions FOR INSERT
WITH CHECK (true);

-- Chat messages: Users can view/create messages in their sessions
CREATE POLICY "Users can view messages in their sessions"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions
    WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Users can create messages in their sessions"
ON public.chat_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions
    WHERE id = session_id AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

-- Profiles: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_knowledge_resources_updated_at
  BEFORE UPDATE ON public.knowledge_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial knowledge resources for testing
INSERT INTO public.knowledge_resources (title, content, category, media_type) VALUES
('Kargil War History', 'The Kargil War was an armed conflict between India and Pakistan that took place between May and July 1999 in the Kargil district of Jammu and Kashmir. The war resulted in a decisive Indian victory.', 'army_history', 'text'),
('Siachen Glacier', 'The Siachen Glacier is the highest battleground on Earth, where the Indian Army maintains a permanent presence at altitudes over 20,000 feet. It represents the indomitable spirit of our soldiers.', 'heritage_sites', 'text'),
('Emergency Contacts', 'Army Helpline: 1800-XXX-XXXX, Police: 100, Medical Emergency: 108, Tourist Helpline: 1800-111-363', 'emergency', 'text');