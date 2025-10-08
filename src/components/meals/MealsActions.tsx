
import AddMealForm from '@/components/AddMealForm';
import EditMealForm from '@/components/EditMealForm';

interface MealsActionsProps {
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  prePopulatedMeal: any;
  setPrePopulatedMeal: (data: any) => void;
  selectedChildId: string;
  selectedDate: string;
  selectedChild: any;
  onAddMeal: () => void;
  editingMeal: any;
  setEditingMeal: (meal: any) => void;
  onEditMeal: () => void;
}
const MealsActions = ({
  showAddForm,
  setShowAddForm,
  prePopulatedMeal,
  setPrePopulatedMeal,
  selectedChildId,
  selectedDate,
  selectedChild,
  onAddMeal,
  editingMeal,
  setEditingMeal,
  onEditMeal,
}: MealsActionsProps) => (
  <>
    <AddMealForm
      isOpen={showAddForm}
      childId={selectedChildId}
      date={selectedDate}
      prePopulatedData={prePopulatedMeal}
      selectedChild={selectedChild}
      onSave={onAddMeal}
      onCancel={() => {
        setShowAddForm(false);
        setPrePopulatedMeal(null);
      }}
    />
    {editingMeal && (
      <EditMealForm
        meal={editingMeal}
        onSave={onEditMeal}
        onCancel={() => setEditingMeal(null)}
      />
    )}
  </>
);

export default MealsActions;
