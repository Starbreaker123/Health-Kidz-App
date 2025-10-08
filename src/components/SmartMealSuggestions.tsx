import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, ChevronDown, ChevronUp, Clock, Users, MessageCircle, Plus, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MealSuggestion } from "@/services/api/mealSuggestionMapper";

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface SmartMealSuggestionsProps {
  mealSuggestions: MealSuggestion[];
  selectedChild: Child | undefined;
  loading?: boolean;
  onMealSelect: (suggestion: MealSuggestion) => void;
  onDeleteSuggestion?: (suggestionId: string) => void;
  onGetMoreSuggestions?: () => void;
}

const EnhancedMealSuggestionCard: React.FC<{
  suggestion: MealSuggestion;
  onSelect: (suggestion: MealSuggestion) => void;
  onDelete?: (suggestionId: string) => void;
}> = ({ suggestion, onSelect, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();

  const getNutrientEmoji = (nutrient: string) => {
    const emojiMap: { [key: string]: string } = {
      'protein': '💪',
      'carbs': '🌾',
      'fat': '🥑',
      'calories': '🔥'
    };
    return emojiMap[nutrient.toLowerCase()] || '🥗';
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-yellow-400 to-orange-400';
      case 'lunch': return 'from-green-400 to-blue-400';
      case 'dinner': return 'from-purple-400 to-pink-400';
      case 'snack': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 bg-white border border-gray-200 relative">
      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(suggestion.id)}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 z-10"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
      
      <CardHeader className={`${isMobile ? 'p-4 pb-2' : 'p-4 pb-3'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-8">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-900 mb-2 line-clamp-2`}>
              {suggestion.name}
            </CardTitle>
            
            {/* Meal Type Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getMealTypeColor(suggestion.mealType)} mb-2`}>
              {suggestion.mealType.charAt(0).toUpperCase() + suggestion.mealType.slice(1)}
            </div>
            
            {/* Quick Info */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {suggestion.prepTime}min
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {suggestion.servings}
              </div>
              <div className="font-medium">
                {suggestion.calories} cal
              </div>
            </div>
          </div>
        </div>
        
        {/* Nutrient Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion.targetNutrients.slice(0, 3).map((nutrient) => (
            <span
              key={nutrient}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
            >
              {getNutrientEmoji(nutrient)}
              {nutrient.replace('_', ' ').toUpperCase()}
            </span>
          ))}
          {suggestion.targetNutrients.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{suggestion.targetNutrients.length - 3}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-4 pt-0'}`}>
        {/* Description */}
        <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 mb-3`}>
          {suggestion.description}
        </p>

        {/* Ingredients Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between p-2 h-auto text-xs text-gray-600 hover:bg-gray-50 mb-3"
        >
          <span>Ingredients ({suggestion.ingredients.length})</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {showDetails && (
          <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
            <div className="text-xs text-blue-800 font-medium mb-1">Main Ingredients:</div>
            <div className="text-xs text-blue-700">
              {suggestion.ingredients.slice(0, 6).join(', ')}
              {suggestion.ingredients.length > 6 && ` +${suggestion.ingredients.length - 6} more`}
            </div>
            <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Ask AI Coach for cooking instructions
            </div>
          </div>
        )}

        {/* Nutrition Summary */}
        <div className="bg-gray-50 rounded-lg p-2 mb-3 text-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="font-medium text-orange-600">{suggestion.calories}</div>
              <div className="text-gray-500">cal</div>
            </div>
            <div>
              <div className="font-medium text-blue-600">{suggestion.protein}g</div>
              <div className="text-gray-500">protein</div>
            </div>
            <div>
              <div className="font-medium text-yellow-600">{suggestion.carbs}g</div>
              <div className="text-gray-500">carbs</div>
            </div>
            <div>
              <div className="font-medium text-green-600">{suggestion.fat}g</div>
              <div className="text-gray-500">fat</div>
            </div>
          </div>
        </div>

        {/* Use Meal Button */}
        <Button
          onClick={() => onSelect(suggestion)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          size={isMobile ? "default" : "sm"}
        >
          Use This Meal
        </Button>
      </CardContent>
    </Card>
  );
};

const GetMoreSuggestionsCard: React.FC<{
  onGetMoreSuggestions: () => void;
  loading?: boolean;
}> = ({ onGetMoreSuggestions, loading = false }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-300 hover:border-green-400">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col items-center justify-center text-center h-full min-h-[300px]`}>
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          ) : (
            <Sparkles className="w-8 h-8 text-green-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Get More AI Suggestions
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Need more meal ideas? Let our AI suggest additional nutrient-targeted meals for your child.
        </p>
        <Button
          onClick={onGetMoreSuggestions}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white disabled:opacity-50"
          size={isMobile ? "default" : "sm"}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Finding Meals...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Get More Suggestions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const SmartMealSuggestions: React.FC<SmartMealSuggestionsProps> = ({
  mealSuggestions,
  selectedChild,
  loading = false,
  onMealSelect,
  onDeleteSuggestion,
  onGetMoreSuggestions
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <Card className="nutri-card shadow-sm border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Finding perfect meals for {selectedChild?.name}...</p>
        </CardContent>
      </Card>
    );
  }

  // When no suggestions and not loading, show only the GetMoreSuggestionsCard
  if (mealSuggestions.length === 0 && onGetMoreSuggestions) {
    return (
      <Card className="nutri-card shadow-lg border-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 overflow-hidden">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center`}>
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl ${isMobile ? 'mr-2' : 'mr-3'} shadow-md`}>
              <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            </div>
            <div className="flex-1">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                Smart Meal Suggestions for {selectedChild?.name}
              </span>
              <div className={`flex items-center ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
                <Sparkles className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-yellow-500 mr-1`} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 font-normal`}>
                  Ready to find nutrient-targeted recommendations
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className={`${isMobile ? 'mb-3 p-2' : 'mb-4 p-3'} bg-white/60 backdrop-blur-sm rounded-lg border border-orange-200`}>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>
              💡 Get AI-powered meal suggestions targeted to your child's nutritional needs!
            </p>
          </div>
          
          <GetMoreSuggestionsCard 
            onGetMoreSuggestions={onGetMoreSuggestions} 
            loading={loading}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="nutri-card shadow-lg border-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 overflow-hidden">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center`}>
          <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl ${isMobile ? 'mr-2' : 'mr-3'} shadow-md`}>
            <Lightbulb className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </div>
          <div className="flex-1">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
              Smart Meal Suggestions for {selectedChild?.name}
            </span>
            <div className={`flex items-center ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
              <Sparkles className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-yellow-500 mr-1`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 font-normal`}>
                {mealSuggestions.length} nutrient-targeted recommendations
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className={`${isMobile ? 'mb-3 p-2' : 'mb-4 p-3'} bg-white/60 backdrop-blur-sm rounded-lg border border-orange-200`}>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700`}>
            💡 These meals target nutrients your child needs. Ask AI Coach for cooking instructions!
          </p>
        </div>
        
        {isMobile ? (
          // Mobile: Vertical scrollable list
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mealSuggestions.map((suggestion) => (
              <EnhancedMealSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onSelect={onMealSelect}
                onDelete={onDeleteSuggestion}
              />
            ))}
            {onGetMoreSuggestions && (
              <GetMoreSuggestionsCard 
                onGetMoreSuggestions={onGetMoreSuggestions} 
                loading={loading}
              />
            )}
          </div>
        ) : (
          // Desktop: Horizontal carousel
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {mealSuggestions.map((suggestion) => (
                <CarouselItem key={suggestion.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <EnhancedMealSuggestionCard
                      suggestion={suggestion}
                      onSelect={onMealSelect}
                      onDelete={onDeleteSuggestion}
                    />
                  </div>
                </CarouselItem>
              ))}
              {onGetMoreSuggestions && (
                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <GetMoreSuggestionsCard 
                      onGetMoreSuggestions={onGetMoreSuggestions} 
                      loading={loading}
                    />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-white shadow-lg" />
            <CarouselNext className="hidden md:flex -right-4 bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-white shadow-lg" />
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartMealSuggestions;
