import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    // No self-registration allowed for any role
    throw new Error("Self-registration is not allowed. All accounts must be created by the system administrator.");

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      createdAt: Date.now(),
    });

    return userId;
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
    role: v.optional(v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete user
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
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

// Create lecturer account (admin only)
export const createLecturerAccount = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    specialization: v.string(),
    department: v.string(),
    experience: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user account
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password: args.password,
      role: "lecturer",
      specialization: args.specialization,
      createdAt: Date.now(),
    });

    // Create lecturer profile
    const lecturerId = await ctx.db.insert("lecturers", {
      userId: userId,
      name: args.name,
      email: args.email,
      specialization: args.specialization,
      availability: true,
      department: args.department,
      experience: args.experience,
    });

    return { userId, lecturerId };
  },
});

// Create student account (admin only)
export const createStudentAccount = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    studentId: v.string(),
    department: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user account
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password: args.password,
      role: "student",
      createdAt: Date.now(),
    });

    // Create student profile
    const studentId = await ctx.db.insert("students", {
      userId: userId,
      name: args.name,
      email: args.email,
      studentId: args.studentId,
      department: args.department,
      year: args.year,
    });

    return { userId, studentId };
  },
});

// Create admin account (system only)
export const createAdminAccount = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password: args.password,
      role: "admin",
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Authenticate user (login)
export const authenticateUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("lecturer"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found. Please contact your administrator for account access.");
    }

    if (user.role !== args.role) {
      throw new Error(`Invalid role. This account is registered as ${user.role}.`);
    }

    // Check password (simple string comparison for now)
    if (user.password !== args.password) {
      throw new Error("Invalid password. Please check your credentials.");
    }

    // Return user data for login
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});
