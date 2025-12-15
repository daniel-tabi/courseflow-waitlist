-- Create waitlist_emails table
CREATE TABLE public.waitlist_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public signup)
CREATE POLICY "Anyone can insert waitlist emails"
ON public.waitlist_emails
FOR INSERT
WITH CHECK (true);

-- Only service role can select/delete (for admin export)
-- No public SELECT policy means only service role can read