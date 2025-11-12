import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all lecturers
export const getLecturers = query({
  handler: async (ctx) => {
    return await ctx.db.query("lecturers").collect();
  },
});

// Add a new lecturer
export const addLecturer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    specialization: v.string(),
    department: v.string(),
    experience: v.number(),
    availability: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if lecturer with this email already exists
    const existingLecturer = await ctx.db
      .query("lecturers")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingLecturer) {
      throw new Error("Lecturer with this email already exists");
    }

    // Create user first
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "lecturer",
      specialization: args.specialization,
      availability: args.availability,
      department: args.department,
    });

    // Create lecturer record
    return await ctx.db.insert("lecturers", {
      userId,
      name: args.name,
      email: args.email,
      specialization: args.specialization,
      availability: args.availability,
      department: args.department,
      experience: args.experience,
    });
  },
});

// Update lecturer
export const updateLecturer = mutation({
  args: {
    id: v.id("lecturers"),
    name: v.string(),
    email: v.string(),
    specialization: v.string(),
    department: v.string(),
    experience: v.number(),
    availability: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // Update lecturer record
    await ctx.db.patch(id, updateData);
    
    // Also update the user record
    const lecturer = await ctx.db.get(id);
    if (lecturer) {
      await ctx.db.patch(lecturer.userId, {
        name: args.name,
        email: args.email,
        specialization: args.specialization,
        availability: args.availability,
        department: args.department,
      });
    }
    
    return id;
  },
});

// Delete lecturer
export const deleteLecturer = mutation({
  args: { id: v.id("lecturers") },
  handler: async (ctx, args) => {
    const lecturer = await ctx.db.get(args.id);
    if (lecturer) {
      // Delete the user record as well
      await ctx.db.delete(lecturer.userId);
      // Delete the lecturer record
      await ctx.db.delete(args.id);
    }
    return args.id;
  },
});

// Get lecturers by specialization
export const getLecturersBySpecialization = query({
  args: { specialization: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lecturers")
      .filter((q) => q.eq(q.field("specialization"), args.specialization))
      .collect();
  },
});

// Get available lecturers
export const getAvailableLecturers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("lecturers")
      .filter((q) => q.eq(q.field("availability"), true))
      .collect();
  },
});

// Get lecturer by user ID
export const getLecturerByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lecturers")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

// Update lecturer availability only
export const updateLecturerAvailability = mutation({
  args: {
    id: v.id("lecturers"),
    availability: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, availability } = args;
    
    // Update only availability
    await ctx.db.patch(id, { availability });
    
    // Also update the user record
    const lecturer = await ctx.db.get(id);
    if (lecturer) {
      await ctx.db.patch(lecturer.userId, { availability });
    }
    
    return { success: true };
  },
});
