
-- Add water_glasses column to meals table
ALTER TABLE public.meals 
ADD COLUMN water_glasses INTEGER DEFAULT 0;
