// Mock API for development without Convex
// This will be replaced when Convex is properly set up

export const mockApi = {
  // Users
  users: {
    createUser: () => Promise.resolve({ _id: "mock-user-id" }),
    getUserByEmail: () => Promise.resolve(null),
    getUserById: () => Promise.resolve(null),
    updateUser: () => Promise.resolve(),
    deleteUser: () => Promise.resolve(),
    getUsers: () => Promise.resolve([]),
    getUsersByRole: () => Promise.resolve([]),
  },
  
  // Lecturers
  lecturers: {
    getLecturers: () => Promise.resolve([]),
    addLecturer: () => Promise.resolve({ _id: "mock-lecturer-id" }),
    updateLecturer: () => Promise.resolve(),
    deleteLecturer: () => Promise.resolve(),
    getLecturersBySpecialization: () => Promise.resolve([]),
    getAvailableLecturers: () => Promise.resolve([]),
    getLecturerByUserId: () => Promise.resolve(null),
  },
  
  // Students
  students: {
    getStudents: () => Promise.resolve([]),
    addStudent: () => Promise.resolve({ _id: "mock-student-id" }),
    updateStudent: () => Promise.resolve(),
    deleteStudent: () => Promise.resolve(),
    getStudentById: () => Promise.resolve(null),
    getStudentsByDepartment: () => Promise.resolve([]),
    getStudentsByYear: () => Promise.resolve([]),
    getStudentByUserId: () => Promise.resolve(null),
  },
  
  // Courses
  courses: {
    getCourses: () => Promise.resolve([]),
    addCourse: () => Promise.resolve({ _id: "mock-course-id" }),
    updateCourse: () => Promise.resolve(),
    deleteCourse: () => Promise.resolve(),
    getCoursesBySpecialization: () => Promise.resolve([]),
    getActiveCourses: () => Promise.resolve([]),
    updateStudentCount: () => Promise.resolve(),
  },
  
  // Matches
  matches: {
    getMatches: () => Promise.resolve([]),
    autoMatch: () => Promise.resolve([]),
    createMatch: () => Promise.resolve({ _id: "mock-match-id" }),
    updateMatch: () => Promise.resolve(),
    deleteMatch: () => Promise.resolve(),
    getMatchesByCourse: () => Promise.resolve([]),
    getMatchesByLecturer: () => Promise.resolve([]),
    getActiveMatches: () => Promise.resolve([]),
  },
  
  // Registrations
  registrations: {
    getRegistrations: () => Promise.resolve([]),
    getRegistrationsByStudent: () => Promise.resolve([]),
    getRegistrationsByCourse: () => Promise.resolve([]),
    registerForCourse: () => Promise.resolve({ _id: "mock-registration-id" }),
    dropCourse: () => Promise.resolve(),
    completeCourse: () => Promise.resolve(),
    getActiveRegistrations: () => Promise.resolve([]),
  },
};


