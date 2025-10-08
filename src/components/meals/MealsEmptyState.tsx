
import { useNavigate } from 'react-router-dom';
import { Utensils, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const MealsEmptyState = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-green-400/90 via-blue-400/90 to-teal-500/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg animate-scale-in">
                  <Utensils className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Meal Logging
              </h1>
              <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow">
                Track daily nutrition and meals for your children
              </p>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No children profiles
            </h3>
            <p className="text-gray-500 mb-4">
              Add a child profile first to start logging meals
            </p>
            <Button
              onClick={() => navigate('/children')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Add Child Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MealsEmptyState;
