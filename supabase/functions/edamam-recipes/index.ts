
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || 'https://nutri-kid.vercel.app'
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mealType, childAge, maxResults } = await req.json()

    // Get credentials from environment variables (Supabase secrets)
    const appId = Deno.env.get('EDAMAM_APP_ID')
    const appKey = Deno.env.get('EDAMAM_APP_KEY')

    if (!appId || !appKey) {
      console.error('Missing Edamam credentials')
      throw new Error('Edamam API credentials not configured')
    }

    // Clean the credentials to remove any potential whitespace or tabs
    const cleanAppId = appId.trim()
    const cleanAppKey = appKey.trim()

    // Minimal credential diagnostics without revealing secrets
    console.log('Using Edamam credentials - App Key length:', cleanAppKey.length)

    // Map meal types to Edamam meal types
    const edamamMealType = mealType === 'snack' ? 'snack' : mealType

    // Build query parameters for Edamam Recipe Search API v2
    const params = new URLSearchParams({
      app_id: cleanAppId,
      app_key: cleanAppKey,
      type: 'public',
      from: '0',
      to: maxResults.toString(),
      random: 'true'
    })

    // Add meal type
    params.append('mealType', edamamMealType)

    // Age-appropriate dietary restrictions
    if (childAge < 3) {
      params.append('health', 'peanut-free')
      params.append('health', 'tree-nut-free')
    } else if (childAge < 6) {
      params.append('health', 'peanut-free')
    }

    // Add calorie range based on meal type and child age
    let calorieRange = { min: 100, max: 400 }
    if (mealType === 'breakfast') {
      calorieRange = { min: 150, max: 350 }
    } else if (mealType === 'lunch' || mealType === 'dinner') {
      calorieRange = { min: 200, max: 500 }
    } else if (mealType === 'snack') {
      calorieRange = { min: 80, max: 200 }
    }

    params.append('calories', `${calorieRange.min}-${calorieRange.max}`)

    const apiUrl = `https://api.edamam.com/api/recipes/v2?${params}`
    // Avoid logging full URLs with secrets
    console.log('Calling Edamam API')

    // Use the correct Edamam Recipe Search API v2 endpoint
    const response = await fetch(apiUrl)
    
    console.log('Edamam API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Edamam API request failed: ${response.status} ${response.statusText}`)
      
      // Try to parse error details if it's JSON
      try {
        JSON.parse(errorText)
      } catch (e) {
        // ignore
      }
      
      throw new Error(`Edamam API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Edamam API response data count:', data.hits?.length || 0)

    return new Response(
      JSON.stringify({ hits: data.hits || [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in edamam-recipes function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
