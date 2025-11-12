import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/functions/_generated/api.js';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Link,
  Plus,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import LecturersTab from '../components/dashboard/LecturersTab';
import CoursesTab from '../components/dashboard/CoursesTab';
import StudentsTab from '../components/dashboard/StudentsTab';
import MatchesTab from '../components/dashboard/MatchesTab';
import UnmatchedCoursesTab from '../components/dashboard/UnmatchedCoursesTab';
import UserCreationForm from '../components/UserCreationForm';
import AnalyticsModal from '../components/analytics/AnalyticsModal';
import SettingsModal from '../components/settings/SettingsModal';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('lecturers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserCreation, setShowUserCreation] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  
  const lecturers = useQuery(api.lecturers.getLecturers);
  const courses = useQuery(api.courses.getCourses);
  const students = useQuery(api.students.getStudents);
  const matches = useQuery(api.matches.getMatches);
  const unmatchedCourses = useQuery(api.matches.getUnmatchedCourses);

  // Check if data is still loading
  const isLoading = lecturers === undefined || courses === undefined || students === undefined || matches === undefined || unmatchedCourses === undefined;

  // Use empty arrays as fallback when data is loaded
  const lecturersData = lecturers || [];
  const coursesData = courses || [];
  const studentsData = students || [];
  const matchesData = matches || [];
  const unmatchedCoursesData = unmatchedCourses || [];
  const autoMatch = useMutation(api.matches.autoMatch);
  const rematchUnavailableLecturers = useMutation(api.matches.rematchUnavailableLecturers);
  const cleanupDuplicateMatches = useMutation(api.matches.cleanupDuplicateMatches);

  const handleAutoMatch = async () => {
    setIsAutoMatching(true);
    try {
      const result = await autoMatch();
      const newMatchesCount = result.newMatches.length;
      const rematchedCount = result.rematchedCourses.length;
      const deactivatedCount = result.deactivatedMatches.length;
      const duplicatesRemoved = result.duplicatesRemoved || 0;
      
      let message = `Auto-matching completed!\n\n`;
      
      if (newMatchesCount > 0) {
        message += `✅ ${newMatchesCount} new matches created\n`;
      }
      
      if (rematchedCount > 0) {
        message += `🔄 ${rematchedCount} courses rematched (lecturer availability changed)\n`;
      }
      
      if (duplicatesRemoved > 0) {
        message += `🧹 ${duplicatesRemoved} duplicate matches removed\n`;
      }
      
      if (deactivatedCount > 0) {
        message += `⚠️ ${deactivatedCount} courses deactivated (no available lecturers)\n`;
      }
      
      if (newMatchesCount === 0 && rematchedCount === 0 && deactivatedCount === 0 && duplicatesRemoved === 0) {
        message += `All courses are properly matched with available lecturers!`;
      }
      
      alert(message);
    } catch (error) {
      console.error('Error during auto-matching:', error);
      alert('Failed to run auto-matching. Please try again.');
    } finally {
      setIsAutoMatching(false);
    }
  };

  const handleRematchUnavailable = async () => {
    setIsAutoMatching(true);
    try {
      const result = await rematchUnavailableLecturers();
      const rematchedCount = result.rematchedCourses.length;
      const unmatchedCount = result.unmatchedCourses.length;
      
      let message = `Rematching completed!\n`;
      if (rematchedCount > 0) {
        message += `✅ ${rematchedCount} courses rematched to available lecturers\n`;
      }
      if (unmatchedCount > 0) {
        message += `⚠️ ${unmatchedCount} courses still need lecturers (no available lecturers for their specialization)`;
      }
      if (rematchedCount === 0 && unmatchedCount === 0) {
        message += `All lecturers are still available - no rematching needed.`;
      }
      
      alert(message);
    } catch (error) {
      console.error('Error during rematching:', error);
      alert('Failed to rematch unavailable lecturers. ' + error.message);
    } finally {
      setIsAutoMatching(false);
    }
  };

  const handleCleanDuplicates = async () => {
    setIsAutoMatching(true);
    try {
      const result = await cleanupDuplicateMatches();
      const duplicatesRemoved = result.duplicatesRemoved;
      
      if (duplicatesRemoved > 0) {
        alert(`🧹 Cleanup completed!\n\nRemoved ${duplicatesRemoved} duplicate matches.\n\nThe matches table should now show each course only once.`);
      } else {
        alert('✅ No duplicate matches found - all matches are clean!');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      alert('Failed to clean duplicate matches. ' + error.message);
    } finally {
      setIsAutoMatching(false);
    }
  };

  // Auto-cleanup duplicates when component loads if there are duplicates
  React.useEffect(() => {
    if (matchesData && matchesData.length > 0) {
      // Check if there are duplicates by counting unique courses
      const uniqueCourses = new Set(matchesData.map(match => match.courseId));
      if (matchesData.length > uniqueCourses.size) {
        console.log('Duplicates detected, running auto-cleanup...');
        handleCleanDuplicates();
      }
    }
  }, [matchesData?.length]);

  const tabs = [
    { id: 'lecturers', label: 'Lecturers', icon: Users, count: lecturersData.length },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: coursesData.length },
    { id: 'students', label: 'Students', icon: GraduationCap, count: studentsData.length },
    { id: 'matches', label: 'Matches', icon: Link, count: matchesData.length },
    { id: 'unmatched', label: 'Unmatched', icon: AlertTriangle, count: unmatchedCoursesData.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lecturers':
        return <LecturersTab />;
      case 'courses':
        return <CoursesTab />;
      case 'students':
        return <StudentsTab />;
      case 'matches':
        return <MatchesTab />;
      case 'unmatched':
        return <UnmatchedCoursesTab unmatchedCourses={unmatchedCoursesData} />;
      default:
        return <LecturersTab />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-neutral-600">Manage courses, lecturers, and students</p>
          </div>
                 <div className="flex items-center space-x-2">
                   <button 
                     onClick={handleAutoMatch}
                     disabled={isAutoMatching}
                     className="btn-primary flex items-center space-x-2 hidden sm:flex disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isAutoMatching ? (
                       <>
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                         <span>Matching...</span>
                       </>
                     ) : (
                       <>
                         <Plus className="h-4 w-4" />
                         <span>Auto Match</span>
                       </>
                     )}
                   </button>
                   <button 
                     onClick={() => setShowUserCreation(true)}
                     className="btn-secondary flex items-center space-x-2 hidden sm:flex"
                   >
                     <Plus className="h-4 w-4" />
                     <span>Create User</span>
                   </button>
                     <button 
                       onClick={() => setShowAnalytics(true)}
                       className="btn-secondary flex items-center space-x-2 hidden sm:flex"
                     >
                       <BarChart3 className="h-4 w-4" />
                       <span>Analytics</span>
                     </button>
                     <button 
                       onClick={() => setShowSettings(true)}
                       className="btn-secondary flex items-center space-x-2 hidden sm:flex"
                     >
                       <Settings className="h-4 w-4" />
                       <span>Settings</span>
                     </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={onLogout}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">Admin</p>
                <p className="text-sm text-neutral-600">System Administrator</p>
              </div>
            </div>
                   <div className="grid grid-cols-1 gap-2">
                     <button 
                       onClick={handleAutoMatch}
                       disabled={isAutoMatching}
                       className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isAutoMatching ? (
                         <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           <span>Matching...</span>
                         </>
                       ) : (
                         <>
                           <Plus className="h-4 w-4" />
                           <span>Auto Match</span>
                         </>
                       )}
                     </button>
                     <button 
                       onClick={() => setShowUserCreation(true)}
                       className="btn-secondary flex items-center justify-center space-x-2"
                     >
                       <Plus className="h-4 w-4" />
                       <span>Create User</span>
                     </button>
                     <button 
                       onClick={() => setShowAnalytics(true)}
                       className="btn-secondary flex items-center justify-center space-x-2"
                     >
                       <BarChart3 className="h-4 w-4" />
                       <span>Analytics</span>
                     </button>
                     <button 
                       onClick={() => setShowSettings(true)}
                       className="btn-secondary flex items-center justify-center space-x-2"
                     >
                       <Settings className="h-4 w-4" />
                       <span>Settings</span>
                     </button>
                   </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="px-4 sm:px-6">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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
               {isLoading ? (
                 <DashboardSkeleton />
               ) : (
                 renderTabContent()
               )}
             </div>

             {/* User Creation Modal */}
             {showUserCreation && (
               <UserCreationForm onClose={() => setShowUserCreation(false)} />
             )}

             {/* Analytics Modal */}
             {showAnalytics && (
               <AnalyticsModal 
                 isOpen={showAnalytics}
                 onClose={() => setShowAnalytics(false)}
                 data={{
                   lecturers: lecturersData,
                   courses: coursesData,
                   students: studentsData,
                   matches: matchesData,
                   unmatchedCourses: unmatchedCoursesData
                 }}
               />
             )}

             {/* Settings Modal */}
             {showSettings && (
               <SettingsModal 
                 isOpen={showSettings}
                 onClose={() => setShowSettings(false)}
               />
             )}
           </div>
         );
       }

       export default AdminDashboard;

