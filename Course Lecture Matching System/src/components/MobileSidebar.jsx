import { X, Users, BookOpen, GraduationCap, Link } from 'lucide-react';

function MobileSidebar({ isOpen, onClose, activeTab, onTabChange, tabs }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </div>
                  <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

export default MobileSidebar;


