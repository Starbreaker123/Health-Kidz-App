
import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Utensils, TrendingUp, Bot, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/', color: 'text-emerald-600', bgColor: 'from-emerald-50 to-green-50', activeColor: 'bg-emerald-500' },
    { id: 'children', label: 'Kids', icon: User, path: '/children', color: 'text-blue-600', bgColor: 'from-blue-50 to-cyan-50', activeColor: 'bg-blue-500' },
    { id: 'meals', label: 'Meals', icon: Utensils, path: '/meals', color: 'text-orange-600', bgColor: 'from-orange-50 to-yellow-50', activeColor: 'bg-orange-500' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress', color: 'text-purple-600', bgColor: 'from-purple-50 to-pink-50', activeColor: 'bg-purple-500' },
    { id: 'ai-coach', label: 'Coach', icon: Bot, path: '/ai-coach', color: 'text-pink-600', bgColor: 'from-pink-50 to-rose-50', activeColor: 'bg-pink-500' },
  ];

  const handleNavigation = (path: string, id: string) => {
    navigate(path);
    onTabChange(id);
  };

  const getFirstName = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Mobile-First Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-scale-in">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  HealthKidz
                </h1>
                {!isMobile && (
                  <p className="text-xs text-gray-500">Smart Nutrition for Growing Kids</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Enhanced Mobile-Responsive User Info */}
              {isMobile ? (
                // Mobile: Just avatar
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.email ? getFirstName(user.email).charAt(0) : 'P'}
                </div>
              ) : (
                // Desktop: Full user info
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.email ? getFirstName(user.email).charAt(0) : 'P'}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.email ? getFirstName(user.email) : 'Parent'}
                    </span>
                    <p className="text-xs text-gray-500">Welcome back! 👋</p>
                  </div>
                </div>
              )}
              
              <Button
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm min-w-[44px] min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                {!isMobile && <span>Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content with Mobile Padding */}
      <main className="max-w-7xl mx-auto pb-20 sm:pb-24">
        <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Enhanced Mobile-First Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg shadow-2xl border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around items-center h-16 sm:h-20 px-2 sm:px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-300 group min-w-[44px] min-h-[44px] ${
                    isActive
                      ? `${item.color} bg-gradient-to-br ${item.bgColor} shadow-lg scale-105 border border-gray-200`
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  <div className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `${item.activeColor} shadow-lg scale-110 text-white` 
                      : 'group-hover:bg-white/70 group-hover:scale-105 group-hover:shadow-md'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200" />
                  </div>
                  <span className={`text-xs font-medium transition-all duration-200 ${
                    isActive ? 'font-semibold scale-105' : ''
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-scale-in shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
