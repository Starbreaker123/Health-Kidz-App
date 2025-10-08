
-- Fix missing RLS policies and ensure proper data isolation

-- First, enable RLS on all tables (some may already be enabled)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Parents can view their own children" ON public.children;
DROP POLICY IF EXISTS "Parents can create children" ON public.children;
DROP POLICY IF EXISTS "Parents can update their own children" ON public.children;
DROP POLICY IF EXISTS "Parents can delete their own children" ON public.children;

DROP POLICY IF EXISTS "Users can view meals for their children" ON public.meals;
DROP POLICY IF EXISTS "Users can create meals for their children" ON public.meals;
DROP POLICY IF EXISTS "Users can update meals for their children" ON public.meals;
DROP POLICY IF EXISTS "Users can delete meals for their children" ON public.meals;

DROP POLICY IF EXISTS "Users can view food items for their children's meals" ON public.food_items;
DROP POLICY IF EXISTS "Users can create food items for their children's meals" ON public.food_items;
DROP POLICY IF EXISTS "Users can update food items for their children's meals" ON public.food_items;
DROP POLICY IF EXISTS "Users can delete food items for their children's meals" ON public.food_items;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create proper RLS policies for children table
CREATE POLICY "Parents can view their own children" 
  ON public.children 
  FOR SELECT 
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create children" 
  ON public.children 
  FOR INSERT 
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own children" 
  ON public.children 
  FOR UPDATE 
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own children" 
  ON public.children 
  FOR DELETE 
  USING (auth.uid() = parent_id);

-- Create proper RLS policies for meals table
CREATE POLICY "Users can view meals for their children" 
  ON public.meals 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = meals.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create meals for their children" 
  ON public.meals 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = meals.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update meals for their children" 
  ON public.meals 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = meals.child_id 
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = meals.child_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete meals for their children" 
  ON public.meals 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.children 
      WHERE children.id = meals.child_id 
      AND children.parent_id = auth.uid()
    )
  );

-- Create proper RLS policies for food_items table
CREATE POLICY "Users can view food items for their children's meals" 
  ON public.food_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.meals 
      JOIN public.children ON children.id = meals.child_id 
      WHERE meals.id = food_items.meal_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create food items for their children's meals" 
  ON public.food_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals 
      JOIN public.children ON children.id = meals.child_id 
      WHERE meals.id = food_items.meal_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update food items for their children's meals" 
  ON public.food_items 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.meals 
      JOIN public.children ON children.id = meals.child_id 
      WHERE meals.id = food_items.meal_id 
      AND children.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals 
      JOIN public.children ON children.id = meals.child_id 
      WHERE meals.id = food_items.meal_id 
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete food items for their children's meals" 
  ON public.food_items 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.meals 
      JOIN public.children ON children.id = meals.child_id 
      WHERE meals.id = food_items.meal_id 
      AND children.parent_id = auth.uid()
    )
  );

-- Create proper RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Add essential database indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON public.children(parent_id);
CREATE INDEX IF NOT EXISTS idx_meals_child_id_date ON public.meals(child_id, date);
CREATE INDEX IF NOT EXISTS idx_food_items_meal_id ON public.food_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Add foreign key constraints for data integrity
ALTER TABLE public.children 
ADD CONSTRAINT fk_children_parent_id 
FOREIGN KEY (parent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.meals 
ADD CONSTRAINT fk_meals_child_id 
FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;

ALTER TABLE public.food_items 
ADD CONSTRAINT fk_food_items_meal_id 
FOREIGN KEY (meal_id) REFERENCES public.meals(id) ON DELETE CASCADE;
