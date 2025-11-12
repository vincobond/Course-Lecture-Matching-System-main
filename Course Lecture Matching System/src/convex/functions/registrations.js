import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all registrations
export const getRegistrations = query({
  handler: async (ctx) => {
    return await ctx.db.query("registrations").collect();
  },
});

// Get registrations by student
export const getRegistrationsByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();
  },
});

// Get registrations by course
export const getRegistrationsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .collect();
  },
});

// Register for a course
export const registerForCourse = mutation({
  args: {
    studentId: v.id("students"),
    courseId: v.id("courses"),
    lecturerId: v.id("lecturers"),
  },
  handler: async (ctx, args) => {
    // Check if student is already registered for this course
    const existingRegistration = await ctx.db
      .query("registrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("studentId"), args.studentId),
          q.eq(q.field("courseId"), args.courseId),
          q.eq(q.field("status"), "registered")
        )
      )
      .first();

    if (existingRegistration) {
      throw new Error("Student is already registered for this course");
    }

    // Check if course has space
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (course.currentStudents >= course.maxStudents) {
      throw new Error("Course is full");
    }

    // Create registration
    const registrationId = await ctx.db.insert("registrations", {
      studentId: args.studentId,
      courseId: args.courseId,
      lecturerId: args.lecturerId,
      registeredAt: Date.now(),
      status: "registered",
    });

    // Update course student count
    await ctx.db.patch(args.courseId, {
      currentStudents: course.currentStudents + 1,
    });

    return registrationId;
  },
});

// Drop a course
export const dropCourse = mutation({
  args: { id: v.id("registrations") },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.id);
    if (!registration) {
      throw new Error("Registration not found");
    }

    // Update registration status
    await ctx.db.patch(args.id, {
      status: "dropped",
    });

    // Update course student count
    const course = await ctx.db.get(registration.courseId);
    if (course) {
      await ctx.db.patch(registration.courseId, {
        currentStudents: Math.max(0, course.currentStudents - 1),
      });
    }

    return args.id;
  },
});

// Complete a course
export const completeCourse = mutation({
  args: { id: v.id("registrations") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "completed",
    });
  },
});

// Get active registrations
export const getActiveRegistrations = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("status"), "registered"))
      .collect();
  },
});


