import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/api.js';
import { useConvexAuth } from 'convex/react';
import { BookOpen, User, Calendar, GraduationCap, Plus, CheckCircle, XCircle, Menu, X, LogOut } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { DashboardSkeleton, StatsCardSkeleton, CourseCardSkeleton } from '../components/ui/SkeletonLoader';

function StudentDashboard({ user, onLogout }) {
  const [showAvailableCourses, setShowAvailableCourses] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [registeringCourses, setRegisteringCourses] = useState(new Set());
  const [droppingCourses, setDroppingCourses] = useState(new Set());
  const [showDropModal, setShowDropModal] = useState(false);
  const [courseToDrop, setCourseToDrop] = useState(null);
  
  // Debug: Log the user object
  console.log('StudentDashboard user:', user);
  
  const student = useQuery(api.students.getStudentByUserId, { userId: user?.id });
  const courses = useQuery(api.courses.getActiveCourses);
  const lecturers = useQuery(api.lecturers.getLecturers);
  const matches = useQuery(api.matches.getActiveMatches);
  const registrations = useQuery(
    api.registrations.getRegistrationsByStudent, 
    student?._id ? { studentId: student._id } : "skip"
  );

  // Loading state
  const isLoading = student === undefined || courses === undefined || lecturers === undefined || matches === undefined || registrations === undefined;
  
  const coursesData = courses || [];
  const lecturersData = lecturers || [];
  const matchesData = matches || [];
  const registrationsData = registrations || [];
  
  const registerForCourse = useMutation(api.registrations.registerForCourse);
  const dropCourse = useMutation(api.registrations.dropCourse);

  const getLecturerInfo = (lecturerId) => {
    return lecturersData.find(lecturer => lecturer._id === lecturerId);
  };

  const getMatchForCourse = (courseId) => {
    return matchesData.find(match => match.courseId === courseId);
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

  const registeredCourses = registrationsData
    .filter(reg => reg.status === 'registered')
    .map(registration => {
      const course = coursesData.find(c => c._id === registration.courseId);
      const match = getMatchForCourse(registration.courseId);
      const lecturer = match ? getLecturerInfo(match.lecturerId) : null;
      
      return {
        ...course,
        registration,
        lecturer,
        match,
      };
    })
    .filter(Boolean);

  const availableCourses = coursesData.filter(course => {
    const isRegistered = registrationsData.some(reg => 
      reg.courseId === course._id && reg.status === 'registered'
    );
    const hasLecturer = getMatchForCourse(course._id);
    return hasLecturer && course.currentStudents < course.maxStudents;
  });

  // Check if a course is registered by the current student
  const isCourseRegistered = (courseId) => {
    return registrationsData.some(reg => 
      reg.courseId === courseId && reg.status === 'registered'
    );
  };

  const handleRegister = async (courseId) => {
    setRegisteringCourses(prev => new Set(prev).add(courseId));
    
    try {
      const match = getMatchForCourse(courseId);
      if (!match) {
        alert('No lecturer assigned to this course yet.');
        return;
      }
      
      await registerForCourse({
        studentId: student._id,
        courseId,
        lecturerId: match.lecturerId,
      });
      alert('Successfully registered for the course!');
    } catch (error) {
      console.error('Error registering for course:', error);
      alert('Failed to register for course. ' + error.message);
    } finally {
      setRegisteringCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleDropClick = (course) => {
    setCourseToDrop(course);
    setShowDropModal(true);
  };

  const handleDropConfirm = async () => {
    if (!courseToDrop) return;
    
    setDroppingCourses(prev => new Set(prev).add(courseToDrop.registration._id));
    
    try {
      await dropCourse({ id: courseToDrop.registration._id });
      alert('Successfully dropped the course!');
      setShowDropModal(false);
      setCourseToDrop(null);
    } catch (error) {
      console.error('Error dropping course:', error);
      alert('Failed to drop course. ' + error.message);
    } finally {
      setDroppingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseToDrop.registration._id);
        return newSet;
      });
    }
  };

  const handleDropCancel = () => {
    setShowDropModal(false);
    setCourseToDrop(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-600" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome, {student?.name || 'Student'}
              </h1>
              <p className="text-neutral-600">{student?.department} • Year {student?.year}</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-neutral-900">
                {student?.name || 'Student'}
              </h1>
              <p className="text-sm text-neutral-600">{student?.department}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium hidden sm:block">
              {student?.studentId}
            </span>
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
                <p className="font-medium text-neutral-900">{student?.name || 'Student'}</p>
                <p className="text-sm text-neutral-600">{student?.studentId}</p>
              </div>
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
                <p className="text-xs sm:text-sm text-neutral-600">Registered Courses</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">{registeredCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Available Courses</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">{availableCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Department</p>
                <p className="text-sm sm:text-lg font-semibold text-neutral-900 truncate">{student?.department}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-neutral-600">Academic Year</p>
                <p className="text-lg sm:text-2xl font-bold text-neutral-900">Year {student?.year}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 mb-6">
          <button
            onClick={() => setShowAvailableCourses(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showAvailableCourses
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            My Courses ({registeredCourses.length})
          </button>
          <button
            onClick={() => setShowAvailableCourses(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAvailableCourses
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-6">
            <div>
              <div className="h-6 bg-neutral-200 rounded w-64 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : !showAvailableCourses ? (
          /* Registered Courses */
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">My Registered Courses</h2>
              {registeredCourses.length === 0 ? (
                <div className="card text-center py-12">
                  <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Courses Registered</h3>
                  <p className="text-neutral-600 mb-4">
                    You haven't registered for any courses yet. Browse available courses to get started.
                  </p>
                  <button
                    onClick={() => setShowAvailableCourses(true)}
                    className="btn-primary"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {registeredCourses.map((course) => (
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
                      
                      {/* Lecturer Info */}
                      {course.lecturer && (
                        <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{course.lecturer.name}</p>
                              <p className="text-sm text-neutral-600">
                                {course.lecturer.department} • {course.lecturer.experience} years experience
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">
                              {course.currentStudents} students
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
                          onClick={() => handleDropClick(course)}
                          disabled={droppingCourses.has(course.registration._id)}
                          className="btn-error flex items-center justify-center space-x-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {droppingCourses.has(course.registration._id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Dropping...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span>Drop Course</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Available Courses */
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Available Courses</h2>
              {availableCourses.length === 0 ? (
                <div className="card text-center py-12">
                  <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Available Courses</h3>
                  <p className="text-neutral-600">
                    All courses are either full or don't have assigned lecturers yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {availableCourses.map((course) => {
                    const match = getMatchForCourse(course._id);
                    const lecturer = match ? getLecturerInfo(match.lecturerId) : null;
                    
                    return (
                      <div key={course._id} className={`card ${isCourseRegistered(course._id) ? 'border-success/20 bg-success/5' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              isCourseRegistered(course._id) 
                                ? 'bg-success/10' 
                                : 'bg-primary-100'
                            }`}>
                              {isCourseRegistered(course._id) ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-primary-600" />
                              )}
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
                            {isCourseRegistered(course._id) && (
                              <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Registered</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-neutral-600 mb-4">{course.description}</p>
                        
                        {/* Lecturer Info */}
                        {lecturer && (
                          <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{lecturer.name}</p>
                                <p className="text-sm text-neutral-600">
                                  {lecturer.department} • {lecturer.experience} years experience
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4 text-neutral-400" />
                              <span className="text-sm text-neutral-600">
                                {course.currentStudents}/{course.maxStudents} students
                              </span>
                            </div>
                          </div>
                          {isCourseRegistered(course._id) ? (
                            <button
                              disabled
                              className="btn-success flex items-center justify-center space-x-2 w-full sm:w-auto opacity-75 cursor-not-allowed"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Registered</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(course._id)}
                              disabled={registeringCourses.has(course._id)}
                              className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {registeringCourses.has(course._id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Registering...</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  <span>Register</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDropModal}
        onClose={handleDropCancel}
        onConfirm={handleDropConfirm}
        title="Drop Course"
        message={`Are you sure you want to drop "${courseToDrop?.title}"? This action cannot be undone.`}
        confirmText="Drop Course"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default StudentDashboard;

