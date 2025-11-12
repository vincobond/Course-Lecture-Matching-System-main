// This file re-exports the Convex API functions for easier import paths.
// It's a temporary solution until the _generated/api.js is correctly resolved by Vite.

import { api as generatedApi } from './functions/_generated/api.js';

export const api = {
  ...generatedApi,
  // Auth functions
  auth: {
    createUser: 'auth:createUser',
    getUserByEmail: 'auth:getUserByEmail',
    getUserById: 'auth:getUserById',
    updateUser: 'auth:updateUser',
    deleteUser: 'auth:deleteUser',
    getUsers: 'auth:getUsers',
    getUsersByRole: 'auth:getUsersByRole',
    createLecturerAccount: 'auth:createLecturerAccount',
    createStudentAccount: 'auth:createStudentAccount',
    createAdminAccount: 'auth:createAdminAccount',
    authenticateUser: 'auth:authenticateUser',
  },
  // Students functions
  students: {
    getStudents: 'students:getStudents',
    addStudent: 'students:addStudent',
    updateStudent: 'students:updateStudent',
    deleteStudent: 'students:deleteStudent',
    getStudentById: 'students:getStudentById',
    getStudentsByDepartment: 'students:getStudentsByDepartment',
    getStudentsByYear: 'students:getStudentsByYear',
    getStudentByUserId: 'students:getStudentByUserId',
  },
  // Courses functions
  courses: {
    getCourses: 'courses:getCourses',
    addCourse: 'courses:addCourse',
    updateCourse: 'courses:updateCourse',
    deleteCourse: 'courses:deleteCourse',
    getCoursesBySpecialization: 'courses:getCoursesBySpecialization',
    getActiveCourses: 'courses:getActiveCourses',
    updateStudentCount: 'courses:updateStudentCount',
  },
  // Lecturers functions
  lecturers: {
    getLecturers: 'lecturers:getLecturers',
    addLecturer: 'lecturers:addLecturer',
    updateLecturer: 'lecturers:updateLecturer',
    updateLecturerAvailability: 'lecturers:updateLecturerAvailability',
    deleteLecturer: 'lecturers:deleteLecturer',
    getLecturersBySpecialization: 'lecturers:getLecturersBySpecialization',
    getAvailableLecturers: 'lecturers:getAvailableLecturers',
    getLecturerByUserId: 'lecturers:getLecturerByUserId',
  },
  // Matches functions
  matches: {
    getMatches: 'matches:getMatches',
    autoMatch: 'matches:autoMatch',
    createMatch: 'matches:createMatch',
    updateMatch: 'matches:updateMatch',
    deleteMatch: 'matches:deleteMatch',
    getMatchesByCourse: 'matches:getMatchesByCourse',
    getMatchesByLecturer: 'matches:getMatchesByLecturer',
    getActiveMatches: 'matches:getActiveMatches',
    getUnmatchedCourses: 'matches:getUnmatchedCourses',
    rematchUnavailableLecturers: 'matches:rematchUnavailableLecturers',
    cleanupDuplicateMatches: 'matches:cleanupDuplicateMatches',
  },
  // Registrations functions
  registrations: {
    getRegistrations: 'registrations:getRegistrations',
    getRegistrationsByStudent: 'registrations:getRegistrationsByStudent',
    getRegistrationsByCourse: 'registrations:getRegistrationsByCourse',
    registerForCourse: 'registrations:registerForCourse',
    dropCourse: 'registrations:dropCourse',
    completeCourse: 'registrations:completeCourse',
    getActiveRegistrations: 'registrations:getActiveRegistrations',
  },
};