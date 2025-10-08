
import Layout from '@/components/Layout';
const MealsLoadingState = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <Layout activeTab={activeTab} onTabChange={setActiveTab}>
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>
  </Layout>
);
export default MealsLoadingState;
