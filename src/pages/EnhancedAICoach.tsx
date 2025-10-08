
import { useState, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Book, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import EducationalContent from '@/components/EducationalContent';
import { calculateAge } from '@/utils/dateUtils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 50; // Prevent memory leaks
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

const EnhancedAICoach = () => {
  const [activeTab, setActiveTab] = useState('ai-coach');
  const [activeSection, setActiveSection] = useState<'chat' | 'education'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [resetTime, setResetTime] = useState(Date.now() + RATE_LIMIT_WINDOW);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChildren();
      initializeChat();
    }
  }, [user]);

  // Rate limiting logic
  const canMakeRequest = (): boolean => {
    const now = Date.now();
    if (now > resetTime) {
      setRequestCount(1);
      setResetTime(now + RATE_LIMIT_WINDOW);
      return true;
    }
    
    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      const waitTime = Math.ceil((resetTime - now) / 1000);
      toast({
        title: "Rate Limit Reached",
        description: `Please wait ${waitTime} seconds before sending another message.`,
        variant: "destructive",
      });
      return false;
    }
    
    setRequestCount(prev => prev + 1);
    return true;
  };

  const validateMessage = (message: string): { isValid: boolean; error?: string } => {
    if (!message.trim()) {
      return { isValid: false, error: 'Please enter a message.' };
    }
    
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { isValid: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
    }
    
    // Check for inappropriate content
    const blockedKeywords = ['medication', 'drug', 'supplement', 'weight loss pill', 'diet pill'];
    const lowerMessage = message.toLowerCase();
    
    for (const keyword of blockedKeywords) {
      if (lowerMessage.includes(keyword)) {
        return { isValid: false, error: 'Please ask about general nutrition and meal planning instead.' };
      }
    }
    
    return { isValid: true };
  };

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id);

      if (error) throw error;
      setChildren(data || []);
      if (data && data.length > 0) {
        setSelectedChildId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to load children profiles. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      content: `Hello! I'm your AI Nutrition Coach for kids! 👋

I'm powered by advanced AI and can help you with:
• Personalized meal planning for ${selectedChild ? selectedChild.name : 'your child'}
• Age-appropriate nutrition advice
• Solutions for picky eating challenges
• Understanding nutrient needs and deficiencies
• Creating balanced, kid-friendly meals

${selectedChild ? `I can see ${selectedChild.name}'s profile and will tailor my advice accordingly.` : 'Add a child profile to get personalized recommendations!'}

**Please note:** I provide general nutrition guidance only. For medical concerns, always consult your pediatrician.

What nutrition question can I help you with today?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    // Rate limiting check
    if (!canMakeRequest()) {
      return;
    }

    // Input validation
    const validation = validateMessage(currentMessage);
    if (!validation.isValid) {
      toast({
        title: "Invalid Message",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Prevent memory leaks by limiting message history
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      return newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages;
    });

    const messageToSend = currentMessage;
    setCurrentMessage('');

    // Generate AI response
    const aiResponseContent = await generateAIResponse(messageToSend);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponseContent,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, aiMessage];
      return newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages;
    });
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Prepare child data for context
      const childData = selectedChild ? {
        name: selectedChild.name,
        age: calculateAge(selectedChild.birth_date),
        weight_kg: selectedChild.weight_kg,
        height_cm: selectedChild.height_cm,
        activity_level: selectedChild.activity_level,
      } : undefined;

      console.log('Sending request to AI nutrition coach...');

      const { data, error } = await supabase.functions.invoke('ai-nutrition-coach', {
        body: {
          message: userInput,
          childData,
          nutritionHistory: undefined,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      console.log('AI response received successfully');
      return data.response;

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Show user-friendly error message
      toast({
        title: "AI Service Unavailable",
        description: "The AI coach is temporarily unavailable. Please try again in a moment.",
        variant: "destructive",
      });
      
      // Fallback response with helpful content
      return `I'm sorry, I'm having trouble connecting right now. Here are some general tips:

🥗 **For balanced nutrition:**
• Include fruits and vegetables in every meal
• Offer whole grains when possible
• Ensure adequate protein sources
• Limit processed foods and added sugars

🍽️ **For picky eaters:**
• Keep offering new foods without pressure
• Let kids help with meal preparation
• Make mealtimes fun and stress-free
• Model healthy eating behaviors

💡 **Need specific help?** Try asking about:
• Meal ideas for specific age groups
• Strategies for common feeding challenges
• Nutrition requirements by age
• Tips for family meal planning

**Important:** For medical concerns, always consult your pediatrician.

Please try again in a moment, or check the Education section for detailed articles.`;
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChild = children.find(child => child.id === selectedChildId);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-orange-400/90 via-red-400/90 to-pink-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg animate-scale-in">
                  <Bot className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                AI Nutrition Coach
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
                Get personalized nutrition advice powered by advanced AI technology
              </p>
              
              {/* Safety Notice */}
              <div className="mt-4 p-3 bg-amber-500/20 backdrop-blur-sm rounded-lg border border-amber-300/30">
                <div className="flex items-center justify-center space-x-2 text-amber-100">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">General guidance only - consult your pediatrician for medical advice</span>
                </div>
              </div>
              
              {/* Child Selector */}
              {children.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/30">
                    <select
                      value={selectedChildId}
                      onChange={(e) => setSelectedChildId(e.target.value)}
                      className="bg-white/90 backdrop-blur-sm px-4 py-3 border-0 rounded-lg text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    >
                      <option value="">Select a child for personalized advice</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name} (Age {calculateAge(child.birth_date)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md p-1 rounded-xl border border-gray-200/50 shadow-lg">
            <button
              onClick={() => setActiveSection('chat')}
              className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === 'chat'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveSection('education')}
              className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === 'education'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-white/50'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Learn
            </button>
          </div>
        </div>

        {/* Chat Section */}
        {activeSection === 'chat' && (
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-gradient-to-br from-orange-50/80 via-red-50/80 to-pink-50/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-white" />
                <span>AI Nutrition Chat</span>
                {selectedChild && (
                  <span className="text-sm font-normal text-white/90">
                    - Personalized for {selectedChild.name}
                  </span>
                )}
                <div className="ml-auto text-xs text-white/70">
                  {requestCount}/{MAX_REQUESTS_PER_WINDOW} requests used
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-sm p-3 rounded-lg shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-white/90 backdrop-blur-sm border border-white/60'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm border border-white/60 p-3 rounded-lg shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about nutrition, meal ideas, or eating challenges..."
                    className="flex-1 px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 backdrop-blur-sm"
                    disabled={isLoading}
                    maxLength={MAX_MESSAGE_LENGTH}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentMessage.trim() || requestCount >= MAX_REQUESTS_PER_WINDOW}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{currentMessage.length}/{MAX_MESSAGE_LENGTH} characters</span>
                  {requestCount >= MAX_REQUESTS_PER_WINDOW && (
                    <span className="text-red-500">Rate limit reached - please wait</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <EducationalContent />
        )}
      </div>
    </Layout>
  );
};

export default EnhancedAICoach;
