import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Link,
  Plus,
  Settings,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import MobileSidebar from '../components/MobileSidebar';
import MobileFAB from '../components/MobileFAB';

function AdminDashboardDev() {
  const [activeTab, setActiveTab] = useState('lecturers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock data for development
  const lecturers = [];
  const courses = [];
  const students = [];
  const matches = [];

  const tabs = [
    { id: 'lecturers', label: 'Lecturers', icon: Users, count: lecturers.length },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
    { id: 'students', label: 'Students', icon: GraduationCap, count: students.length },
    { id: 'matches', label: 'Matches', icon: Link, count: matches.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lecturers':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Lecturers</h2>
                <p className="text-sm sm:text-base text-neutral-600">Manage lecturer information and specializations</p>
              </div>
              <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span>Add Lecturer</span>
              </button>
            </div>
            <div className="card text-center py-12">
              <Users className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Lecturers Yet</h3>
              <p className="text-neutral-600">
                Add lecturers to get started with course matching.
              </p>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Courses</h2>
                <p className="text-sm sm:text-base text-neutral-600">Manage course information and specializations</p>
              </div>
              <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span>Add Course</span>
              </button>
            </div>
            <div className="card text-center py-12">
              <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Courses Yet</h3>
              <p className="text-neutral-600">
                Add courses to enable student registration and lecturer matching.
              </p>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Students</h2>
                <p className="text-sm sm:text-base text-neutral-600">Manage student information and registrations</p>
              </div>
              <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </button>
            </div>
            <div className="card text-center py-12">
              <GraduationCap className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Students Yet</h3>
              <p className="text-neutral-600">
                Add students to enable course registration.
              </p>
            </div>
          </div>
        );
      case 'matches':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Course-Lecturer Matches</h2>
                <p className="text-sm sm:text-base text-neutral-600">Manage automatic and manual course-lecturer assignments</p>
              </div>
              <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span>Auto Match</span>
              </button>
            </div>
            <div className="card text-center py-12">
              <Link className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Matches Yet</h3>
              <p className="text-neutral-600">
                Add lecturers and courses, then use auto-match to create assignments.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="responsive-heading font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="responsive-text text-neutral-600">Manage courses, lecturers, and students</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button className="btn-primary flex items-center space-x-2 text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Auto Match</span>
              <span className="sm:hidden">Match</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 capitalize">{activeTab}</h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-neutral-600" />
            ) : (
              <Menu className="h-5 w-5 text-neutral-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block bg-white border-b border-neutral-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {renderTabContent()}
      </div>
      
      {/* Mobile Floating Action Button */}
      <MobileFAB 
        onClick={() => {
          // Handle add action based on active tab
          console.log(`Add new ${activeTab}`);
        }}
        label={`Add ${activeTab.slice(0, -1)}`}
      />
    </div>
  );
}

export default AdminDashboardDev;
