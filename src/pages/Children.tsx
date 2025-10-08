import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Users, Heart, Baby, Weight, Ruler, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Child } from '@/types';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddChildForm from '@/components/AddChildForm';
import EditChildForm from '@/components/EditChildForm';
import Layout from '@/components/Layout';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';

// Using shared Child type

const Children = () => {
  const [activeTab, setActiveTab] = useState('children');
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      logger.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to load children profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (childData: Omit<Child, 'id'>) => {
    try {
      const { error } = await supabase
        .from('children')
        .insert([{ ...childData, parent_id: user?.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child profile created successfully",
      });
      
      setShowAddForm(false);
      fetchChildren();
    } catch (error) {
      logger.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Failed to create child profile",
        variant: "destructive",
      });
    }
  };

  const handleEditChild = async (childData: Omit<Child, 'id'>) => {
    if (!editingChild) return;

    try {
      const { error } = await supabase
        .from('children')
        .update(childData)
        .eq('id', editingChild.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child profile updated successfully",
      });
      
      setEditingChild(null);
      fetchChildren();
    } catch (error) {
      logger.error('Error updating child:', error);
      toast({
        title: "Error",
        description: "Failed to update child profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Are you sure you want to delete this child profile?')) return;

    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child profile deleted successfully",
      });
      
      fetchChildren();
    } catch (error) {
      logger.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child profile",
        variant: "destructive",
      });
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'female': return 'from-pink-400 to-red-400';
      case 'male': return 'from-blue-400 to-indigo-400';
      default: return 'from-green-400 to-teal-400';
    }
  };

  const toggleChildExpansion = (childId: string) => {
    setExpandedChild(expandedChild === childId ? null : childId);
  };

  if (loading) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-4 sm:space-y-6">
        {/* Compact Mobile-First Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-blue-400/80 via-purple-400/80 to-pink-500/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 shadow-lg sm:shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                <div className="bg-white/20 backdrop-blur-md p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-white drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-lg">
                    Children Profiles
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg drop-shadow mt-1">
                    Manage nutrition profiles and goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children List */}
        {children.length === 0 ? (
          <div className="space-y-4">
            <Card className="border-dashed border-2">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No children profiles yet</h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Create your first child profile to start tracking nutrition</p>
              </CardContent>
            </Card>
            
            {/* Add Child Button - Prominent when no children */}
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Child
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {children.map((child, index) => {
              const clinical = calculateClinicalNutritionRecommendations(child);
              const calorieGoal = child.daily_calorie_goal || clinical.calories;
              return (
                <Card 
                  key={child.id} 
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl"
                >
                  <CardContent className="p-4 sm:p-5 relative">
                    {/* Main Child Info */}
                    <div 
                      className="cursor-pointer active:bg-gray-50 transition-colors duration-150"
                      onClick={() => toggleChildExpansion(child.id)}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Avatar */}
                        <div className={`w-14 h-14 bg-gradient-to-r ${getGenderColor(child.gender)} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <span className="text-white font-semibold text-xl">
                            {child.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {/* Child Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{child.name}</h3>
                          {/* Age and Gender Pills */}
                          <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-sm font-medium">
                              <Baby className="w-4 h-4" />
                              <span>{calculateAge(child.birth_date)} years</span>
                            </span>
                            {child.gender && (
                              <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-sm font-medium">
                                <User className="w-4 h-4" />
                                <span className="capitalize">{child.gender}</span>
                              </span>
                            )}
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-sm font-medium">
                              <Target className="w-4 h-4" />
                              <span>{calorieGoal} cal/day</span>
                            </span>
                          </div>
                          {/* Quick Stats - Always Visible */}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {child.weight_kg && (
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Weight className="w-4 h-4" />
                                <span>{child.weight_kg} kg</span>
                              </div>
                            )}
                            {child.height_cm && (
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Ruler className="w-4 h-4" />
                                <span>{child.height_cm} cm</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Action Buttons - Mobile Optimized */}
                      <div className="flex sm:hidden flex-col space-y-2 mt-4 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChild(child);
                          }}
                          className="w-full justify-start min-h-[44px] min-w-[44px] text-base"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChild(child.id);
                          }}
                          className="w-full justify-start min-h-[44px] min-w-[44px] text-base text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Delete Profile
                        </Button>
                      </div>
                      {/* Desktop Action Buttons */}
                      <div className="hidden sm:flex absolute top-4 right-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChild(child);
                          }}
                          className="h-11 w-11 p-0 min-h-[44px] min-w-[44px]"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChild(child.id);
                          }}
                          className="h-11 w-11 p-0 min-h-[44px] min-w-[44px] text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    {/* Expanded Details */}
                    {expandedChild === child.id && (
                      <div className="px-2 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 bg-gray-50/50">
                        <div className="pt-4 space-y-3">
                          <h4 className="font-medium text-gray-900 text-base">Additional Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Birth Date:</span>
                                <span className="font-medium">{new Date(child.birth_date).toLocaleDateString()}</span>
                              </div>
                              {child.activity_level && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Activity Level:</span>
                                  <span className="font-medium capitalize">{child.activity_level.replace('_', ' ')}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {child.weight_kg && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Weight:</span>
                                  <span className="font-medium">{child.weight_kg} kg</span>
                                </div>
                              )}
                              {child.height_cm && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Height:</span>
                                  <span className="font-medium">{child.height_cm} cm</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {/* Visual Separator */}
                  {index < children.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  )}
                </Card>
              );
            })}
            {/* Add Child Button - Below children list */}
            <div className="pt-2">
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full min-h-[44px] min-w-[44px] h-12 sm:h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-dashed border-transparent hover:border-white/20 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Child
              </Button>
            </div>
            {/* Add compact bottom spacing on very small screens */}
            <div className="h-2 sm:h-4" />
          </div>
        )}

        {/* Add Child Form Modal */}
        {showAddForm && (
          <AddChildForm
            onSave={handleAddChild}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Child Form Modal */}
        {editingChild && (
          <EditChildForm
            child={editingChild}
            onSave={handleEditChild}
            onCancel={() => setEditingChild(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Children;
