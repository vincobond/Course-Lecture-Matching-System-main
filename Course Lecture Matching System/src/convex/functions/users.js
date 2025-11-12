import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new user
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student")),
    specialization: v.optional(v.string()),
    availability: v.optional(v.boolean()),
    department: v.optional(v.string()),
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user with this email already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      specialization: args.specialization,
      availability: args.availability,
      department: args.department,
      studentId: args.studentId,
    });
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Get user by ID
export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update user
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    specialization: v.optional(v.string()),
    availability: v.optional(v.boolean()),
    department: v.optional(v.string()),
    studentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

// Delete user
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get all users
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get users by role
export const getUsersByRole = query({
  args: { role: v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();
  },
});


