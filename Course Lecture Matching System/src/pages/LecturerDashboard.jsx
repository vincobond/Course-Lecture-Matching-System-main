import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/api.js';
import { BookOpen, Users, Calendar, User, Mail, GraduationCap, Menu, X, LogOut, ToggleLeft, ToggleRight } from 'lucide-react';
import { DashboardSkeleton, StatsCardSkeleton, CourseCardSkeleton } from '../components/ui/SkeletonLoader';

function LecturerDashboard({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const lecturer = useQuery(api.lecturers.getLecturerByUserId, { userId: user?.id });
  const updateLecturerAvailability = useMutation(api.lecturers.updateLecturerAvailability);
  const matches = useQuery(
    api.matches.getMatchesByLecturer, 
    lecturer?._id ? { lecturerId: lecturer._id } : "skip"
  );
  const courses = useQuery(api.courses.getCourses);
  const students = useQuery(api.students.getStudents);
  const registrations = useQuery(api.registrations.getRegistrations);

  // Loading state
  const isLoading = lecturer === undefined || matches === undefined || courses === undefined || students === undefined || registrations === undefined;
  
  const matchesData = matches || [];
  const coursesData = courses || [];
  const studentsData = students || [];
  const registrationsData = registrations || [];

  const getCourseInfo = (courseId) => {
    return coursesData.find(course => course._id === courseId);
  };

  // Add error boundary for missing user
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const getStudentRegistrations = (courseId) => {
    return registrationsData.filter(reg => reg.courseId === courseId && reg.status === 'registered');
  };

  const handleAvailabilityToggle = async () => {
    if (!lecturer) return;
    
    try {
      await updateLecturerAvailability({
        id: lecturer._id,
        availability: !lecturer.availability
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowCourseDetails(true);
  };

  const handleCloseDetails = () => {
    setShowCourseDetails(false);
    setSelectedCourse(null);
  };

  const assignedCourses = matchesData
    .filter(match => match.isActive)
    .map(match => {
      const course = getCourseInfo(match.courseId);
      const studentRegistrations = getStudentRegistrations(match.courseId);
      return {
        ...course,
        matchId: match._id,
        studentCount: studentRegistrations.length,
        students: studentRegistrations.map(reg => 
          studentsData.find(student => student._id === reg.studentId)
        ).filter(Boolean),
      };
    })
    .filter(Boolean);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome, {lecturer?.name || 'Lecturer'}
              </h1>
              <p className="text-neutral-600">{lecturer?.department} • {lecturer?.specialization}</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-neutral-900">
                {lecturer?.name || 'Lecturer'}
              </h1>
              <p className="text-sm text-neutral-600">{lecturer?.department}</p>
            </div>
          </div>
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={handleAvailabilityToggle}
                     className={`px-3 py-1 rounded-full text-sm font-medium hidden sm:flex items-center space-x-2 transition-colors ${
                       lecturer?.availability 
                         ? 'bg-success/10 text-success hover:bg-success/20' 
                         : 'bg-error/10 text-error hover:bg-error/20'
                     }`}
                   >
                     {lecturer?.availability ? (
                       <ToggleRight className="h-4 w-4" />
                     ) : (
                       <ToggleLeft className="h-4 w-4" />
                     )}
                     <span>{lecturer?.availability ? 'Available' : 'Not Available'}</span>
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
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{lecturer?.name || 'Lecturer'}</p>
                <p className="text-sm text-neutral-600">{lecturer?.specialization}</p>
              </div>
            </div>
                   <button
                     onClick={handleAvailabilityToggle}
                     className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                   >
                     <span className="text-sm text-neutral-600">Availability</span>
                     <div className="flex items-center space-x-2">
                       {lecturer?.availability ? (
                         <ToggleRight className="h-4 w-4 text-success" />
                       ) : (
                         <ToggleLeft className="h-4 w-4 text-error" />
                       )}
                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                         lecturer?.availability 
                           ? 'bg-success/10 text-success' 
                           : 'bg-error/10 text-error'
                       }`}>
                         {lecturer?.availability ? 'Available' : 'Not Available'}
                       </span>
                     </div>
                   </button>
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

      {/* Stats Cards */}
      <div className="dashboard-content">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Assigned Courses</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">{assignedCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-success/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Total Students</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                  {assignedCourses.reduce((total, course) => total + course.studentCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Experience</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">{lecturer?.experience || 0} years</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Specialization</p>
                <p className="text-sm sm:text-lg font-semibold text-neutral-900 truncate">{lecturer?.specialization}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Assigned Courses */}
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <div className="h-6 bg-neutral-200 rounded w-64 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Your Assigned Courses</h2>
            {assignedCourses.length === 0 ? (
              <div className="card text-center py-12">
                <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Courses Assigned</h3>
                <p className="text-neutral-600">
                  You haven't been assigned to any courses yet. Contact the admin for course assignments.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {assignedCourses.map((course) => (
                  <div key={course._id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">{course.title}</h3>
                          <p className="text-neutral-600">{course.code} • {course.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                          {course.specialization}
                        </span>
                        <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs font-medium">
                          {course.credits} credits
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600">
                            {course.studentCount} students registered
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600">
                            Max: {course.maxStudents} students
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewDetails(course)}
                        className="btn-primary"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Students List */}
                    {course.students.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <h4 className="text-sm font-medium text-neutral-700 mb-3">Registered Students</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {course.students.map((student) => (
                            <div key={student._id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-4 w-4 text-primary-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                  {student.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {student.studentId} • Year {student.year}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Course Details Modal */}
      {showCourseDetails && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Course Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Course Info */}
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">{selectedCourse.title}</h3>
                    <p className="text-neutral-600">{selectedCourse.code} • {selectedCourse.semester}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedCourse.specialization}
                      </span>
                      <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedCourse.credits} credits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                  <p className="text-neutral-600">{selectedCourse.description}</p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-600">Current Students</p>
                        <p className="text-lg font-semibold text-neutral-900">{selectedCourse.currentStudents}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-neutral-600">Max Students</p>
                        <p className="text-lg font-semibold text-neutral-900">{selectedCourse.maxStudents}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registered Students */}
                {selectedCourse.registeredStudents && selectedCourse.registeredStudents.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-3">Registered Students ({selectedCourse.registeredStudents.length})</h4>
                    <div className="space-y-2">
                      {selectedCourse.registeredStudents.map(student => (
                        <div key={student._id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{student.name}</p>
                            <p className="text-sm text-neutral-600">{student.studentId} • {student.department}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCloseDetails}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturerDashboard;

