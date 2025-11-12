import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Link, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  X,
  Menu
} from 'lucide-react';

function AnalyticsModal({ isOpen, onClose, data }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!isOpen) return null;

  const {
    lecturers = [],
    courses = [],
    students = [],
    matches = [],
    unmatchedCourses = []
  } = data;

  // Calculate statistics
  const totalLecturers = lecturers.length;
  const availableLecturers = lecturers.filter(l => l.availability).length;
  const unavailableLecturers = totalLecturers - availableLecturers;

  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.isActive).length;
  const inactiveCourses = totalCourses - activeCourses;

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive !== false).length;

  const totalMatches = matches.length;
  const activeMatches = matches.filter(m => m.isActive).length;
  const inactiveMatches = totalMatches - activeMatches;

  const totalUnmatched = unmatchedCourses.length;
  const needsLecturer = unmatchedCourses.filter(c => !c.hasAvailableLecturers).length;
  const hasLecturers = totalUnmatched - needsLecturer;

  // Calculate matching efficiency
  const matchingEfficiency = totalCourses > 0 ? Math.round((activeMatches / totalCourses) * 100) : 0;

  // Calculate average experience
  const avgExperience = lecturers.length > 0 
    ? Math.round(lecturers.reduce((sum, l) => sum + (l.experience || 0), 0) / lecturers.length)
    : 0;

  // Calculate specialization distribution
  const specializationCount = {};
  lecturers.forEach(lecturer => {
    const spec = lecturer.specialization;
    specializationCount[spec] = (specializationCount[spec] || 0) + 1;
  });

  const topSpecializations = Object.entries(specializationCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">System Analytics</h2>
              <p className="text-xs sm:text-sm text-neutral-600 hidden sm:block">Comprehensive overview of your course matching system</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-neutral-50 border-b border-neutral-200 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-600">Total Lecturers</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-900">{totalLecturers}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-xs text-green-600">Available: {availableLecturers}</span>
                <span className="text-xs text-red-600">Unavailable: {unavailableLecturers}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-600">Total Courses</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-900">{totalCourses}</p>
                </div>
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-xs text-green-600">Active: {activeCourses}</span>
                <span className="text-xs text-gray-600">Inactive: {inactiveCourses}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-purple-600">Total Students</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-900">{totalStudents}</p>
                </div>
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-xs text-green-600">Active: {activeStudents}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-orange-600">Active Matches</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-900">{activeMatches}</p>
                </div>
                <Link className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="text-xs text-green-600">Active: {activeMatches}</span>
                <span className="text-xs text-red-600">Inactive: {inactiveMatches}</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matching Efficiency */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Matching Efficiency</h3>
                <div className="flex items-center space-x-2">
                  {matchingEfficiency >= 80 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : matchingEfficiency >= 60 ? (
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Course Coverage</span>
                  <span className="text-sm font-medium text-neutral-900">{matchingEfficiency}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      matchingEfficiency >= 80 ? 'bg-green-500' : 
                      matchingEfficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${matchingEfficiency}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500">
                  {activeMatches} of {totalCourses} courses have active assignments
                </p>
              </div>
            </div>

            {/* Unmatched Courses */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">Unmatched Courses</h3>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Total Unmatched</span>
                  <span className="text-sm font-medium text-neutral-900">{totalUnmatched}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Need Lecturers</span>
                  <span className="text-sm font-medium text-red-600">{needsLecturer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Have Available Lecturers</span>
                  <span className="text-sm font-medium text-green-600">{hasLecturers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialization Distribution */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Lecturer Specializations</h3>
            <div className="space-y-3">
              {topSpecializations.map(([specialization, count], index) => (
                <div key={specialization} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                    </div>
                    <span className="font-medium text-neutral-900">{specialization}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">{count} lecturers</span>
                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(specializationCount))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-neutral-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Avg. Experience</p>
                  <p className="text-lg font-bold text-neutral-900">{avgExperience} years</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">System Health</p>
                  <p className="text-lg font-bold text-green-600">
                    {matchingEfficiency >= 80 ? 'Excellent' : 
                     matchingEfficiency >= 60 ? 'Good' : 'Needs Attention'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-neutral-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Last Updated</p>
                  <p className="text-lg font-bold text-neutral-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModal;
