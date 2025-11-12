import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all students
export const getStudents = query({
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});

// Add a new student
export const addStudent = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    department: v.string(),
    year: v.number(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if student with this email already exists
    const existingStudent = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingStudent) {
      throw new Error("Student with this email already exists");
    }

    // Check if student ID already exists
    const existingStudentId = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();

    if (existingStudentId) {
      throw new Error("Student with this ID already exists");
    }

    // Create student record
    return await ctx.db.insert("students", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      studentId: args.studentId,
      department: args.department,
      year: args.year,
    });
  },
});

// Update student
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    name: v.string(),
    email: v.string(),
    studentId: v.string(),
    department: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // Update student record
    await ctx.db.patch(id, updateData);
    
    // Also update the user record
    const student = await ctx.db.get(id);
    if (student) {
      await ctx.db.patch(student.userId, {
        name: args.name,
        email: args.email,
        studentId: args.studentId,
        department: args.department,
      });
    }
    
    return id;
  },
});

// Delete student
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (student) {
      // Delete all registrations for this student
      const registrations = await ctx.db
        .query("registrations")
        .filter((q) => q.eq(q.field("studentId"), args.id))
        .collect();

      for (const registration of registrations) {
        await ctx.db.delete(registration._id);
      }

      // Delete the user record as well
      await ctx.db.delete(student.userId);
      // Delete the student record
      await ctx.db.delete(args.id);
    }
    return args.id;
  },
});

// Get student by ID
export const getStudentById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get students by department
export const getStudentsByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("department"), args.department))
      .collect();
  },
});

// Get students by year
export const getStudentsByYear = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("year"), args.year))
      .collect();
  },
});

// Get student by user ID
export const getStudentByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});
