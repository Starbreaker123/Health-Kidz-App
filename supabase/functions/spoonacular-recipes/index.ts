
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { targetNutrients, mealType, childAge, maxResults } = await req.json()

    const apiKey = Deno.env.get('SPOONACULAR_API_KEY')
    if (!apiKey) {
      throw new Error('Spoonacular API key not configured')
    }

    // Build query parameters based on nutrient gaps and child age
    const params = new URLSearchParams({
      apiKey: apiKey,
      number: maxResults.toString(),
      type: mealType === 'snack' ? 'appetizer' : mealType,
      addRecipeNutrition: 'true',
      instructionsRequired: 'false',
      fillIngredients: 'true',
      sort: 'popularity'
    })

    // Add nutrient constraints based on gaps
    if (targetNutrients.protein > 0) {
      params.append('minProtein', Math.min(targetNutrients.protein * 0.3, 20).toString())
    }
    if (targetNutrients.calories > 0) {
      params.append('maxCalories', Math.min(targetNutrients.calories * 0.4, 600).toString())
    }
    if (targetNutrients.carbs > 0) {
      params.append('minCarbs', Math.min(targetNutrients.carbs * 0.2, 30).toString())
    }

    // Age-appropriate constraints
    if (childAge < 3) {
      params.append('excludeIngredients', 'nuts,honey,raw eggs')
    } else if (childAge < 6) {
      params.append('excludeIngredients', 'nuts')
    }

    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`)
    
    if (!response.ok) {
      throw new Error(`Spoonacular API request failed: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ results: data.results || [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in spoonacular-recipes function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
