
-- Create meals table to store individual meals
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_calories INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create food_items table to store individual food items in meals
CREATE TABLE public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'serving',
  calories_per_unit INTEGER NOT NULL DEFAULT 0,
  protein_g DECIMAL(6,2) DEFAULT 0,
  carbs_g DECIMAL(6,2) DEFAULT 0,
  fat_g DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for meals (users can only access meals for their own children)
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

-- RLS policies for food_items (users can only access food items for meals of their children)
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

-- Create indexes for better performance
CREATE INDEX idx_meals_child_id ON public.meals(child_id);
CREATE INDEX idx_meals_date ON public.meals(date);
CREATE INDEX idx_food_items_meal_id ON public.food_items(meal_id);
