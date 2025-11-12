import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
         // Users table for authentication
         users: defineTable({
           email: v.string(),
           name: v.string(),
           password: v.string(), // Added password field
           role: v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student")),
           specialization: v.optional(v.string()), // For lecturers
           availability: v.optional(v.boolean()), // For lecturers
           studentId: v.optional(v.string()), // For students
           department: v.optional(v.string()),
         }).index("by_email", ["email"]),

  // Courses table
  courses: defineTable({
    title: v.string(),
    code: v.string(),
    description: v.string(),
    specialization: v.string(), // Required for matching
    credits: v.number(),
    semester: v.string(),
    maxStudents: v.number(),
    currentStudents: v.number(),
    isActive: v.boolean(),
  }).index("by_specialization", ["specialization"]),

  // Lecturers table
  lecturers: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    specialization: v.string(),
    availability: v.boolean(),
    department: v.string(),
    experience: v.number(), // years of experience
  }).index("by_specialization", ["specialization"]),

  // Students table
  students: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    department: v.string(),
    year: v.number(),
  }),

  // Course-Lecturer matches
  matches: defineTable({
    courseId: v.id("courses"),
    lecturerId: v.id("lecturers"),
    isAutoMatched: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_course", ["courseId"])
    .index("by_lecturer", ["lecturerId"]),

  // Student course registrations
  registrations: defineTable({
    studentId: v.id("students"),
    courseId: v.id("courses"),
    lecturerId: v.id("lecturers"),
    registeredAt: v.number(),
    status: v.union(v.literal("registered"), v.literal("dropped"), v.literal("completed")),
  }).index("by_student", ["studentId"])
    .index("by_course", ["courseId"]),
});

