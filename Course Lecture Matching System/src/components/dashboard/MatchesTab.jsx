import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/functions/_generated/api.js';
import { Link, RefreshCw, Edit, Trash2, BookOpen, User, CheckCircle, XCircle } from 'lucide-react';
import { StatsCardSkeleton, CourseCardSkeleton, EmptyStateSkeleton } from '../ui/SkeletonLoader';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

function MatchesTab() {
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const matches = useQuery(api.matches.getMatches);
  const courses = useQuery(api.courses.getCourses);
  const lecturers = useQuery(api.lecturers.getLecturers);

  const isLoading = matches === undefined || courses === undefined || lecturers === undefined;
  const matchesData = matches || [];
  const coursesData = courses || [];
  const lecturersData = lecturers || [];
  
  const autoMatch = useMutation(api.matches.autoMatch);
  const updateMatch = useMutation(api.matches.updateMatch);
  const deleteMatch = useMutation(api.matches.deleteMatch);

  const handleAutoMatch = async () => {
    setIsAutoMatching(true);
    try {
      await autoMatch();
    } catch (error) {
      console.error('Error during auto-matching:', error);
    } finally {
      setIsAutoMatching(false);
    }
  };

  const handleToggleMatch = async (matchId, isActive) => {
    try {
      await updateMatch({ id: matchId, isActive });
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleDeleteMatchClick = (match) => {
    setMatchToDelete(match);
    setShowDeleteModal(true);
  };

  const handleDeleteMatchConfirm = async () => {
    if (!matchToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteMatch({ id: matchToDelete._id });
      setShowDeleteModal(false);
      setMatchToDelete(null);
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Failed to delete match. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMatchCancel = () => {
    setShowDeleteModal(false);
    setMatchToDelete(null);
  };

  const getCourseInfo = (courseId) => {
    return coursesData.find(course => course._id === courseId);
  };

  const getLecturerInfo = (lecturerId) => {
    return lecturersData.find(lecturer => lecturer._id === lecturerId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-neutral-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-10 bg-neutral-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Course-Lecturer Matches</h2>
          <p className="text-sm sm:text-base text-neutral-600">Manage automatic and manual course-lecturer assignments</p>
        </div>
        <button
          onClick={handleAutoMatch}
          disabled={isAutoMatching}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isAutoMatching ? 'animate-spin' : ''}`} />
          <span>{isAutoMatching ? 'Matching...' : 'Auto Match'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Link className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Total Matches</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-900">{matchesData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Active Matches</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                {matchesData.filter(match => match.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Total Courses</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-900">{coursesData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-neutral-600">Total Lecturers</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-900">{lecturersData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Matches */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Active Course Assignments</h3>
          <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
            {matches.filter(match => match.isActive).length} Active
          </span>
        </div>
        
        {matchesData.filter(match => match.isActive).length === 0 ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No active course assignments</p>
            <p className="text-sm text-neutral-400">Run auto-matching to assign courses to lecturers</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchesData
              .filter(match => match.isActive)
              .map((match) => {
                const course = getCourseInfo(match.courseId);
                const lecturer = getLecturerInfo(match.lecturerId);
                
                if (!course || !lecturer) return null;
                
                return (
                  <div key={match._id} className="bg-neutral-50 rounded-lg p-3 sm:p-4 border border-neutral-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h4 className="font-semibold text-neutral-900 truncate">{course.title}</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                                {course.code}
                              </span>
                              <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
                                {course.specialization}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-success/10 rounded-full flex items-center justify-center">
                                <User className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900 text-sm sm:text-base">{lecturer.name}</p>
                                <p className="text-xs text-neutral-500">{lecturer.department}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lecturer.availability 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-error/10 text-error'
                              }`}>
                                {lecturer.availability ? 'Available' : 'Unavailable'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                match.isAutoMatched 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {match.isAutoMatched ? 'Auto-Assigned' : 'Manual'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleMatch(match._id, false)}
                          className="p-2 text-neutral-400 hover:text-error transition-colors"
                          title="Deactivate Assignment"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMatchClick(match)}
                          className="p-2 text-neutral-400 hover:text-error transition-colors"
                          title="Remove Assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Inactive Matches */}
      {matchesData.filter(match => !match.isActive).length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Inactive Assignments</h3>
            <span className="bg-error/10 text-error px-3 py-1 rounded-full text-sm font-medium">
              {matchesData.filter(match => !match.isActive).length} Inactive
            </span>
          </div>
          
          <div className="space-y-3">
            {matchesData
              .filter(match => !match.isActive)
              .map((match) => {
                const course = getCourseInfo(match.courseId);
                const lecturer = getLecturerInfo(match.lecturerId);
                
                if (!course || !lecturer) return null;
                
                return (
                  <div key={match._id} className="bg-error/5 rounded-lg p-4 border border-error/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-error/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-error" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-neutral-900">{course.title}</h4>
                            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                              {course.code}
                            </span>
                            <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
                              {course.specialization}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 bg-error/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-error" />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{lecturer.name}</p>
                                <p className="text-xs text-neutral-500">{lecturer.department}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lecturer.availability 
                                  ? 'bg-success/10 text-success' 
                                  : 'bg-error/10 text-error'
                              }`}>
                                {lecturer.availability ? 'Available' : 'Unavailable'}
                              </span>
                              <span className="bg-error/10 text-error px-2 py-1 rounded-full text-xs font-medium">
                                Inactive
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleMatch(match._id, true)}
                          className="p-2 text-neutral-400 hover:text-success transition-colors"
                          title="Reactivate Assignment"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMatchClick(match)}
                          className="p-2 text-neutral-400 hover:text-error transition-colors"
                          title="Remove Assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteMatchCancel}
        onConfirm={handleDeleteMatchConfirm}
        title="Delete Match"
        message="Are you sure you want to delete this course-lecturer match? This will permanently remove the assignment."
        itemName={matchToDelete ? `${getCourseInfo(matchToDelete.courseId)?.title} - ${getLecturerInfo(matchToDelete.lecturerId)?.name}` : ''}
        itemType="match"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MatchesTab;

