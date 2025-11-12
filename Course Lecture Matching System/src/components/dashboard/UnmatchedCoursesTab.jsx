import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/functions/_generated/api.js';
import { BookOpen, AlertTriangle, User, Users, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

function UnmatchedCoursesTab({ unmatchedCourses }) {
  const [isLoading, setIsLoading] = useState(false);
  const autoMatch = useMutation(api.matches.autoMatch);

  const handleAutoMatch = async () => {
    setIsLoading(true);
    try {
      await autoMatch();
      alert('Auto-matching completed! Check the Matches tab to see results.');
    } catch (error) {
      console.error('Error during auto-matching:', error);
      alert('Failed to run auto-matching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (course) => {
    if (course.hasAvailableLecturers) {
      return 'text-warning'; // Yellow - has lecturers but not matched
    } else {
      return 'text-error'; // Red - no available lecturers
    }
  };

  const getStatusIcon = (course) => {
    if (course.hasAvailableLecturers) {
      return <AlertTriangle className="h-4 w-4" />;
    } else {
      return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (course) => {
    if (course.hasAvailableLecturers) {
      return `Has ${course.availableLecturersCount} available lecturer(s) - needs matching`;
    } else {
      return 'No available lecturers for this specialization';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Auto-Match Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Unmatched Courses</h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Courses that need lecturer assignments. Run auto-matching to assign available lecturers.
          </p>
        </div>
        <button
          onClick={handleAutoMatch}
          disabled={isLoading}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Matching...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Run Auto-Match</span>
            </>
          )}
        </button>
      </div>

      {/* Unmatched Courses List */}
      {unmatchedCourses.length === 0 ? (
        <div className="card text-center py-12">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">All Courses Matched!</h3>
          <p className="text-neutral-600">
            All active courses have been assigned to lecturers.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {unmatchedCourses.map((course) => (
            <div key={course._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{course.title}</h3>
                    <p className="text-neutral-600">{course.code} • {course.semester}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    {course.specialization}
                  </span>
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs font-medium">
                    {course.credits} credits
                  </span>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4">{course.description}</p>
              
              {/* Status Information */}
              <div className="flex items-center space-x-2 p-3 bg-neutral-50 rounded-lg">
                <div className={`flex items-center space-x-2 ${getStatusColor(course)}`}>
                  {getStatusIcon(course)}
                  <span className="text-sm font-medium">
                    {getStatusText(course)}
                  </span>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      {course.currentStudents}/{course.maxStudents} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      {course.hasAvailableLecturers ? `${course.availableLecturersCount} lecturer(s) available` : 'No lecturers available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <p className="text-sm text-neutral-600">Total Unmatched</p>
          <p className="text-2xl font-bold text-neutral-900">{unmatchedCourses.length}</p>
        </div>
        
        <div className="card text-center">
          <div className="h-10 w-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <p className="text-sm text-neutral-600">With Available Lecturers</p>
          <p className="text-2xl font-bold text-neutral-900">
            {unmatchedCourses.filter(course => course.hasAvailableLecturers).length}
          </p>
        </div>
        
        <div className="card text-center">
          <div className="h-10 w-10 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <XCircle className="h-5 w-5 text-error" />
          </div>
          <p className="text-sm text-neutral-600">No Lecturers Available</p>
          <p className="text-2xl font-bold text-neutral-900">
            {unmatchedCourses.filter(course => !course.hasAvailableLecturers).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UnmatchedCoursesTab;
