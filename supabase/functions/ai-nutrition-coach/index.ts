import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || 'https://nutri-kid.vercel.app';
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_RESPONSE_LENGTH = 2000;

// Content filtering - block inappropriate content
const BLOCKED_KEYWORDS = [
  'harmful', 'dangerous', 'toxic', 'poison', 'medication', 'drug', 'supplement',
  'weight loss', 'diet pill', 'extreme diet', 'starvation', 'eating disorder'
];

interface ChatRequest {
  message: string;
  childData?: {
    name: string;
    age: number;
    weight_kg?: number;
    height_cm?: number;
    activity_level?: string;
    dietary_restrictions?: string[];
  };
  nutritionHistory?: {
    recentMeals: any[];
    todaysIntake: any;
    weeklyTrends: any;
  };
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const checkRateLimit = (clientId: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
};

const validateInput = (message: string): { isValid: boolean; error?: string } => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { isValid: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
  }

  // Check for blocked keywords
  const lowerMessage = message.toLowerCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return { isValid: false, error: 'Your message contains content that cannot be processed. Please ask about general nutrition and meal planning.' };
    }
  }

  return { isValid: true };
};

const sanitizeResponse = (response: string): string => {
  // Limit response length
  if (response.length > MAX_RESPONSE_LENGTH) {
    response = response.substring(0, MAX_RESPONSE_LENGTH) + '\n\n[Response truncated for safety]';
  }

  // Remove any potential harmful content
  const harmfulPatterns = [
    /\b(medication|drug|supplement)\b/gi,
    /\b(weight loss pill|diet pill)\b/gi,
    /\b(dangerous|harmful|toxic)\b/gi
  ];

  for (const pattern of harmfulPatterns) {
    response = response.replace(pattern, '[content filtered]');
  }

  return response;
};

const getFallbackResponse = (childData?: any): string => {
  const childName = childData?.name || 'your child';
  
  return `I'm currently experiencing technical difficulties, but here are some general nutrition tips for ${childName}:

🥗 **Balanced Meals:**
• Include fruits and vegetables in every meal
• Choose whole grains when possible
• Ensure adequate protein sources
• Limit processed foods and added sugars

🍽️ **Healthy Eating Habits:**
• Encourage regular meal times
• Make mealtimes enjoyable and stress-free
• Offer variety in foods and flavors
• Stay hydrated with water throughout the day

💡 **For specific nutrition concerns, please consult with your pediatrician or a registered dietitian.**

Please try again in a few minutes, or check the Education section for detailed nutrition articles.`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientId = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait before making another request.',
          response: getFallbackResponse()
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable',
          response: getFallbackResponse()
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { message, childData, nutritionHistory }: ChatRequest = await req.json();

    // Validate input
    const validation = validateInput(message);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: validation.error,
          response: getFallbackResponse(childData)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing AI nutrition coaching request', { messageLength: message.length, hasChildData: !!childData, hasNutritionHistory: !!nutritionHistory });

    const systemPrompt = generateSystemPrompt(childData, nutritionHistory);
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    // Add timeout to prevent function from hanging
    const timeoutMs = 25000; // 25 seconds (Supabase functions have ~30s timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800, // Reduced from 1000 for cost control
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_LOW_AND_ABOVE" // More strict for child nutrition
            }
          ]
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error('No response generated from Gemini');
      }

      // Sanitize the AI response
      const sanitizedResponse = sanitizeResponse(aiResponse);

      console.log('AI response generated and sanitized successfully');

      return new Response(
        JSON.stringify({ 
          response: sanitizedResponse,
          usage: data.usageMetadata 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle timeout specifically
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        console.error('Request timeout - Gemini API took too long to respond');
        throw new Error('Request timeout - The AI service is taking too long to respond. Please try again.');
      }
      
      // Re-throw other errors to be caught by outer catch
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in ai-nutrition-coach function:', error);
    
    // Provide more specific error messages
    let errorMessage = 'AI service temporarily unavailable';
    if (error.message?.includes('timeout')) {
      errorMessage = 'The AI service is taking too long to respond. Please try again.';
    } else if (error.message?.includes('404')) {
      errorMessage = 'AI model not found. Please check configuration.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        response: getFallbackResponse()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

const generateSystemPrompt = (childData?: any, nutritionHistory?: any) => {
  let prompt = `You are a specialized pediatric nutrition AI coach for the HealthKidz app. You help parents with:

1. Age-appropriate nutrition advice and meal planning
2. Addressing picky eating and feeding challenges
3. Understanding nutritional needs by developmental stage
4. Creating balanced, kid-friendly meal ideas
5. Managing dietary restrictions and allergies

Guidelines:
- Always provide evidence-based, pediatric-specific advice
- Be encouraging and supportive to parents
- Suggest practical, realistic solutions
- Consider food safety for different age groups
- Emphasize variety, balance, and making mealtimes enjoyable
- When suggesting meals, include approximate prep times and difficulty levels
- NEVER recommend medications, supplements, or extreme diets
- Always recommend consulting healthcare professionals for medical concerns`;

  if (childData) {
    prompt += `\n\nChild Information:
- Name: ${childData.name}
- Age: ${childData.age} years old
- Weight: ${childData.weight_kg ? `${childData.weight_kg}kg` : 'Not specified'}
- Height: ${childData.height_cm ? `${childData.height_cm}cm` : 'Not specified'}
- Activity Level: ${childData.activity_level || 'Not specified'}`;

    if (childData.dietary_restrictions?.length > 0) {
      prompt += `\n- Dietary Restrictions: ${childData.dietary_restrictions.join(', ')}`;
    }
  }

  if (nutritionHistory?.todaysIntake) {
    prompt += `\n\nToday's Nutrition Summary:
- Calories: ${nutritionHistory.todaysIntake.calories || 0}
- Protein: ${nutritionHistory.todaysIntake.protein_g || 0}g
- Recent meals: ${nutritionHistory.recentMeals?.length || 0} logged today`;
  }

  prompt += `\n\nRespond in a warm, professional tone. Keep responses concise but informative. When suggesting meals, format them clearly with ingredients and basic instructions.`;

  return prompt;
};
