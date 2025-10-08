
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Heart, Brain, Bone, Eye, Shield } from 'lucide-react';

interface EducationalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'nutrition' | 'development' | 'health' | 'tips';
  readTime: number;
  ageGroup: string;
  icon: React.ReactNode;
}

const educationalArticles: EducationalArticle[] = [
  {
    id: '1',
    title: 'Building Strong Bones: Calcium & Vitamin D for Kids',
    excerpt: 'Learn why calcium and vitamin D are crucial for your child\'s bone development and growth.',
    content: `Calcium and vitamin D work together to build strong bones in growing children. Calcium provides the building blocks, while vitamin D helps the body absorb calcium effectively.

**Best Food Sources:**
- Dairy products (milk, cheese, yogurt)
- Leafy greens (kale, broccoli)
- Fortified plant milks
- Sardines and salmon
- Almonds and sesame seeds

**Daily Requirements:**
- Ages 1-3: 700mg calcium, 600 IU vitamin D
- Ages 4-8: 1000mg calcium, 600 IU vitamin D
- Ages 9-18: 1300mg calcium, 600 IU vitamin D

**Fun Tips:**
- Make smoothies with yogurt and berries
- Try cheese and crackers as snacks
- Spend time outdoors for natural vitamin D`,
    category: 'nutrition',
    readTime: 3,
    ageGroup: 'all',
    icon: <Bone className="w-5 h-5" />
  },
  {
    id: '2',
    title: 'Brain Food: Omega-3s for Cognitive Development',
    excerpt: 'Discover how omega-3 fatty acids support brain development and learning in children.',
    content: `Omega-3 fatty acids, particularly DHA, are essential for brain development, memory, and learning capacity in children.

**Benefits:**
- Improved focus and attention
- Better memory formation
- Enhanced problem-solving skills
- Reduced inflammation

**Best Sources:**
- Fatty fish (salmon, mackerel, sardines)
- Walnuts and chia seeds
- Flax seeds and hemp hearts
- Algae-based supplements

**Kid-Friendly Ideas:**
- Fish tacos with mild white fish
- Walnut butter sandwiches
- Chia seed puddings
- Smoothies with ground flax`,
    category: 'development',
    readTime: 4,
    ageGroup: 'all',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: '3',
    title: 'Iron Power: Preventing Anemia in Growing Kids',
    excerpt: 'Understanding iron deficiency and how to ensure your child gets enough of this vital mineral.',
    content: `Iron is crucial for carrying oxygen in the blood and supporting energy levels. Iron deficiency is common in children and can affect learning and behavior.

**Signs of Iron Deficiency:**
- Fatigue and weakness
- Pale skin or nail beds
- Difficulty concentrating
- Frequent infections

**Iron-Rich Foods:**
- Lean meats and poultry
- Beans and lentils
- Fortified cereals
- Spinach and dark leafy greens
- Tofu and tempeh

**Absorption Tips:**
- Pair with vitamin C foods (oranges, strawberries)
- Cook in cast iron pans
- Avoid dairy with iron-rich meals`,
    category: 'health',
    readTime: 5,
    ageGroup: 'toddler+',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: '4',
    title: 'Colorful Eating: Getting Kids to Love Vegetables',
    excerpt: 'Practical strategies to increase vegetable intake and make healthy eating fun for children.',
    content: `Getting children to eat vegetables can be challenging, but with creativity and patience, you can develop their taste for nutritious foods.

**Strategies That Work:**
- Start early and be persistent
- Make vegetables fun and colorful
- Involve kids in cooking
- Be a positive role model

**Creative Ideas:**
- Rainbow veggie challenges
- Vegetable art and faces
- Hidden veggies in familiar foods
- Dips and sauces for raw veggies
- Garden-to-table experiences

**Remember:**
- It can take 10+ exposures to accept new foods
- Keep offering without pressure
- Focus on the experience, not the outcome`,
    category: 'tips',
    readTime: 4,
    ageGroup: 'all',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: '5',
    title: 'Immune System Support: Vitamins C & D',
    excerpt: 'How proper nutrition can help strengthen your child\'s immune system naturally.',
    content: `A strong immune system helps children fight off infections and stay healthy year-round. Key nutrients play important roles in immune function.

**Immune-Supporting Nutrients:**
- Vitamin C: Supports white blood cell function
- Vitamin D: Regulates immune responses
- Zinc: Essential for immune cell development
- Vitamin A: Maintains barrier defenses

**Top Immune Foods:**
- Citrus fruits and berries
- Bell peppers and broccoli
- Sweet potatoes and carrots
- Yogurt with live cultures
- Garlic and ginger

**Lifestyle Factors:**
- Adequate sleep (10-14 hours for young children)
- Regular physical activity
- Stress management
- Good hygiene practices`,
    category: 'health',
    readTime: 3,
    ageGroup: 'all',
    icon: <Shield className="w-5 h-5" />
  }
];

interface EducationalContentProps {
  selectedCategory?: string;
  maxArticles?: number;
}

const EducationalContent: React.FC<EducationalContentProps> = ({
  selectedCategory,
  maxArticles = 6
}) => {
  const [selectedArticle, setSelectedArticle] = React.useState<EducationalArticle | null>(null);

  const filteredArticles = educationalArticles.filter(article => 
    !selectedCategory || article.category === selectedCategory
  ).slice(0, maxArticles);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'tips': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedArticle) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedArticle.icon}
              <div>
                <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-sm text-gray-500">{selectedArticle.readTime} min read</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {selectedArticle.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="ml-4 text-gray-700">
                    {paragraph.substring(2)}
                  </li>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-gray-700 mb-3">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Nutrition Education</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Card 
            key={article.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedArticle(article)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime} min</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EducationalContent;
