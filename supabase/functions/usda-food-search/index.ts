import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }[];
}

interface FoodSearchResult {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_size_g: number;
  common_units: string[];
}

serve(async (req) => {
  // Enable CORS with all necessary headers for Supabase
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || 'https://nutri-kid.vercel.app'
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, X-Client-Info, X-Client-Info-Key, X-Client-Info-Value, X-Client-Info-Version, X-Client-Info-Platform, X-Client-Info-Device, X-Client-Info-OS, X-Client-Info-Browser, X-Client-Info-User-Agent',
        'Access-Control-Max-Age': '86400',
      }
    })
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get('USDA_API_KEY')
    
    if (!apiKey) {
      console.error('USDA API key not configured')
      throw new Error('USDA API key not configured')
    }

    // Parse request body
    const { query, maxResults = 10 } = await req.json()

    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Query must be at least 2 characters long' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, X-Client-Info, X-Client-Info-Key, X-Client-Info-Value, X-Client-Info-Version, X-Client-Info-Platform, X-Client-Info-Device, X-Client-Info-OS, X-Client-Info-Browser, X-Client-Info-User-Agent',
          }
        }
      )
    }

    // Build USDA API URL
    const usdaApiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy&pageSize=${maxResults}&sortBy=dataType.keyword&sortOrder=asc&api_key=${apiKey}`

    console.log('Calling USDA API')

    // Make request to USDA API
    const response = await fetch(usdaApiUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`USDA API request failed: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`USDA API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    console.log('USDA API response count:', data.foods?.length || 0)

    // Transform USDA data to our format
    const foods: FoodSearchResult[] = data.foods?.map((food: USDAFood) => {
      // Extract nutrients per 100g
      const nutrients = food.foodNutrients || []
      
      const getNutrientValue = (nutrientId: number) => {
        const nutrient = nutrients.find(n => n.nutrientId === nutrientId)
        return nutrient?.value || 0
      }

      // Common nutrient IDs in USDA database
      const calories = getNutrientValue(1008) // Energy (kcal)
      const protein = getNutrientValue(1003) // Protein
      const carbs = getNutrientValue(1005) // Carbohydrates
      const fat = getNutrientValue(1004) // Total lipid (fat)

      return {
        id: `usda-${food.fdcId}`,
        name: food.description,
        calories_per_100g: calories,
        protein_per_100g: protein,
        carbs_per_100g: carbs,
        fat_per_100g: fat,
        serving_size_g: 100, // Default serving size (100g)
        common_units: ['100g', 'cup', 'piece', 'gram', 'ounce', 'tablespoon', 'teaspoon']
      }
    }).filter((food: FoodSearchResult) => food.calories_per_100g > 0) || []

    return new Response(
      JSON.stringify({ foods }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, X-Client-Info, X-Client-Info-Key, X-Client-Info-Value, X-Client-Info-Version, X-Client-Info-Platform, X-Client-Info-Device, X-Client-Info-OS, X-Client-Info-Browser, X-Client-Info-User-Agent',
        }
      }
    )

  } catch (error) {
    console.error('Error in usda-food-search function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to search foods',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, X-Client-Info, X-Client-Info-Key, X-Client-Info-Value, X-Client-Info-Version, X-Client-Info-Platform, X-Client-Info-Device, X-Client-Info-OS, X-Client-Info-Browser, X-Client-Info-User-Agent',
        }
      }
    )
  }
}) 