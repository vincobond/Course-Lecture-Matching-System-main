/**
 * User Creation Script for Course Lecture Matching System
 * 
 * This script helps you create users in the Convex database.
 * Run this with: node create-users.js
 */

// Example users to create
const usersToCreate = [
  // Admin users
  {
    type: 'admin',
    email: 'admin@university.edu',
    name: 'System Administrator',
  },
  
  // Lecturer users
  {
    type: 'lecturer',
    email: 'john.smith@university.edu',
    name: 'Dr. John Smith',
    specialization: 'Computer Science',
    department: 'Computer Science',
    experience: 10,
  },
  {
    type: 'lecturer',
    email: 'sarah.johnson@university.edu',
    name: 'Dr. Sarah Johnson',
    specialization: 'Mathematics',
    department: 'Mathematics',
    experience: 8,
  },
  {
    type: 'lecturer',
    email: 'mike.davis@university.edu',
    name: 'Prof. Mike Davis',
    specialization: 'Physics',
    department: 'Physics',
    experience: 12,
  },
  
  // Student users
  {
    type: 'student',
    email: 'alice.student@university.edu',
    name: 'Alice Johnson',
    studentId: 'STU001',
    department: 'Computer Science',
    year: 3,
  },
  {
    type: 'student',
    email: 'bob.student@university.edu',
    name: 'Bob Wilson',
    studentId: 'STU002',
    department: 'Mathematics',
    year: 2,
  },
  {
    type: 'student',
    email: 'carol.student@university.edu',
    name: 'Carol Brown',
    studentId: 'STU003',
    department: 'Physics',
    year: 4,
  },
];

console.log('🎓 Course Lecture Matching System - User Creation Guide');
console.log('=====================================================\n');

console.log('📋 Users to Create:');
console.log('===================\n');

usersToCreate.forEach((user, index) => {
  console.log(`${index + 1}. ${user.type.toUpperCase()}: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  if (user.specialization) {
    console.log(`   Specialization: ${user.specialization}`);
  }
  if (user.studentId) {
    console.log(`   Student ID: ${user.studentId}`);
  }
  console.log('');
});

console.log('🔧 How to Create Users in Convex:');
console.log('=================================\n');

console.log('1. Open your Convex dashboard: https://dashboard.convex.dev');
console.log('2. Go to your project: Course Lecture Matching System');
console.log('3. Click on "Functions" tab');
console.log('4. Use the "Run Function" feature to create users:\n');

console.log('For Admin Users:');
console.log('----------------');
console.log('Function: auth:createAdminAccount');
console.log('Args: {');
console.log('  "email": "admin@university.edu",');
console.log('  "name": "System Administrator",');
console.log('  "password": "admin123"');
console.log('}\n');

console.log('For Lecturer Users:');
console.log('-------------------');
console.log('Function: auth:createLecturerAccount');
console.log('Args: {');
console.log('  "email": "john.smith@university.edu",');
console.log('  "name": "Dr. John Smith",');
console.log('  "password": "lecturer123",');
console.log('  "specialization": "Computer Science",');
console.log('  "department": "Computer Science",');
console.log('  "experience": 10');
console.log('}\n');

console.log('For Student Users:');
console.log('-----------------');
console.log('Function: auth:createStudentAccount');
console.log('Args: {');
console.log('  "email": "alice.student@university.edu",');
console.log('  "name": "Alice Johnson",');
console.log('  "password": "student123",');
console.log('  "studentId": "STU001",');
console.log('  "department": "Computer Science",');
console.log('  "year": 3');
console.log('}\n');

console.log('🚀 Quick Start Commands:');
console.log('========================\n');

console.log('1. Create Admin:');
console.log('   npx convex run auth:createAdminAccount "{\\"email\\":\\"admin@university.edu\\",\\"name\\":\\"System Administrator\\"}"');
console.log('');

console.log('2. Create Lecturer:');
console.log('   npx convex run auth:createLecturerAccount "{\\"email\\":\\"john.smith@university.edu\\",\\"name\\":\\"Dr. John Smith\\",\\"specialization\\":\\"Computer Science\\",\\"department\\":\\"Computer Science\\",\\"experience\\":10}"');
console.log('');

console.log('3. Create Student:');
console.log('   npx convex run auth:createStudentAccount "{\\"email\\":\\"alice.student@university.edu\\",\\"name\\":\\"Alice Johnson\\",\\"studentId\\":\\"STU001\\",\\"department\\":\\"Computer Science\\",\\"year\\":3}"');
console.log('');

console.log('✅ After creating users, you can login with:');
console.log('   Email: admin@university.edu');
console.log('   Password: admin123');
console.log('   Role: admin');
console.log('');
console.log('   Email: john.smith@university.edu');
console.log('   Password: lecturer123');
console.log('   Role: lecturer');
console.log('');
console.log('   Email: alice.student@university.edu');
console.log('   Password: student123');
console.log('   Role: student');
console.log('');

console.log('🔐 Security Note:');
console.log('================');
console.log('Only users created in the database can login.');
console.log('Random emails and passwords will be rejected.');
console.log('All accounts must be created by the system administrator.');
