import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all courses
export const getCourses = query({
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

// Add a new course
export const addCourse = mutation({
  args: {
    title: v.string(),
    code: v.string(),
    description: v.string(),
    specialization: v.string(),
    credits: v.number(),
    semester: v.string(),
    maxStudents: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if course with this code already exists
    const existingCourse = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("code"), args.code))
      .first();

    if (existingCourse) {
      throw new Error("Course with this code already exists");
    }

    return await ctx.db.insert("courses", {
      ...args,
      currentStudents: 0,
    });
  },
});

// Update course
export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    title: v.string(),
    code: v.string(),
    description: v.string(),
    specialization: v.string(),
    credits: v.number(),
    semester: v.string(),
    maxStudents: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

// Delete course
export const deleteCourse = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    // Check if course has any registrations
    const registrations = await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("courseId"), args.id))
      .collect();

    if (registrations.length > 0) {
      throw new Error("Cannot delete course with existing student registrations");
    }

    // Delete any matches for this course
    const matches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("courseId"), args.id))
      .collect();

    for (const match of matches) {
      await ctx.db.delete(match._id);
    }

    return await ctx.db.delete(args.id);
  },
});

// Get courses by specialization
export const getCoursesBySpecialization = query({
  args: { specialization: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("specialization"), args.specialization))
      .collect();
  },
});

// Get active courses
export const getActiveCourses = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Update course student count
export const updateStudentCount = mutation({
  args: { 
    courseId: v.id("courses"),
    increment: v.boolean() // true to increment, false to decrement
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const newCount = args.increment 
      ? course.currentStudents + 1 
      : Math.max(0, course.currentStudents - 1);

    return await ctx.db.patch(args.courseId, {
      currentStudents: newCount
    });
  },
});


