import { Plus } from 'lucide-react';

function MobileFAB({ onClick, label = "Add" }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 lg:hidden bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg touch-target mobile-button z-30 transition-all duration-200 hover:scale-105"
      aria-label={label}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

export default MobileFAB;


