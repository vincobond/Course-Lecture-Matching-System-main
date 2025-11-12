import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all matches with deduplication
export const getMatches = query({
  handler: async (ctx) => {
    const allMatches = await ctx.db.query("matches").collect();
    
    // Group matches by courseId
    const courseMatchMap = new Map();
    for (const match of allMatches) {
      if (!courseMatchMap.has(match.courseId)) {
        courseMatchMap.set(match.courseId, []);
      }
      courseMatchMap.get(match.courseId).push(match);
    }

    // For each course, return only the best match
    const deduplicatedMatches = [];
    for (const [courseId, courseMatches] of courseMatchMap) {
      if (courseMatches.length > 0) {
        // Sort by priority: Active > Inactive, then by most recent
        courseMatches.sort((a, b) => {
          if (a.isActive !== b.isActive) {
            return b.isActive - a.isActive; // Active first
          }
          return b.updatedAt - a.updatedAt; // Most recent first
        });
        
        // Return only the best match for this course
        deduplicatedMatches.push(courseMatches[0]);
      }
    }

    return deduplicatedMatches;
  },
});

// Auto-match courses to lecturers based on specialization
export const autoMatch = mutation({
  handler: async (ctx) => {
    // Get all active courses
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const newMatches = [];
    const rematchedCourses = [];
    const deactivatedMatches = [];
    const now = Date.now();

    // First, check existing matches and handle availability changes
    const existingMatches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const match of existingMatches) {
      const lecturer = await ctx.db.get(match.lecturerId);
      const course = await ctx.db.get(match.courseId);
      
      if (!course) continue;
      
      // If lecturer is unavailable, try to rematch
      if (lecturer && !lecturer.availability) {
        // Deactivate the current match
        await ctx.db.patch(match._id, { 
          isActive: false,
          updatedAt: now
        });

        // Find available lecturers for this course's specialization
        const availableLecturers = await ctx.db
          .query("lecturers")
          .filter((q) => 
            q.and(
              q.eq(q.field("availability"), true),
              q.eq(q.field("specialization"), course.specialization)
            )
          )
          .collect();

        if (availableLecturers.length > 0) {
          // Sort by experience and select the best one
          availableLecturers.sort((a, b) => b.experience - a.experience);
          const selectedLecturer = availableLecturers[0];

          // Update the existing match instead of creating a new one
          await ctx.db.patch(match._id, {
            lecturerId: selectedLecturer._id,
            isActive: true,
            updatedAt: now,
          });

          rematchedCourses.push({
            courseId: course._id,
            oldLecturerId: match.lecturerId,
            newLecturerId: selectedLecturer._id,
            matchId: match._id,
          });
        } else {
          // No available lecturers - keep as inactive
          deactivatedMatches.push({
            courseId: course._id,
            specialization: course.specialization,
          });
        }
      }
    }

    // Check for courses that have inactive matches but now have available lecturers
    const inactiveMatches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("isActive"), false))
      .collect();

    for (const match of inactiveMatches) {
      const lecturer = await ctx.db.get(match.lecturerId);
      const course = await ctx.db.get(match.courseId);
      
      if (!course || !lecturer) continue;
      
      // If the lecturer is now available, reactivate the match
      if (lecturer.availability) {
        await ctx.db.patch(match._id, {
          isActive: true,
          updatedAt: now,
        });

        rematchedCourses.push({
          courseId: course._id,
          lecturerId: lecturer._id,
          matchId: match._id,
          reactivated: true,
        });
      }
    }

    // Now handle courses without any matches
    for (const course of courses) {
      // Check if course already has ANY match (active or inactive)
      const existingMatches = await ctx.db
        .query("matches")
        .filter((q) => q.eq(q.field("courseId"), course._id))
        .collect();

      // If course has any matches, skip it
      if (existingMatches.length > 0) continue;

      // Get available lecturers for this specific course's specialization
      const availableLecturers = await ctx.db
        .query("lecturers")
        .filter((q) => 
          q.and(
            q.eq(q.field("availability"), true),
            q.eq(q.field("specialization"), course.specialization)
          )
        )
        .collect();

      if (availableLecturers.length > 0) {
        // Sort by experience (most experienced first)
        availableLecturers.sort((a, b) => b.experience - a.experience);
        
        // Select the most experienced lecturer
        const selectedLecturer = availableLecturers[0];

        // Create the match
        const matchId = await ctx.db.insert("matches", {
          courseId: course._id,
          lecturerId: selectedLecturer._id,
          isAutoMatched: true,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });

        newMatches.push({
          courseId: course._id,
          lecturerId: selectedLecturer._id,
          matchId,
        });
      }
    }

    // Clean up any duplicate matches for the same course
    const allMatches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const courseMatchMap = new Map();
    const duplicatesToDeactivate = [];

    for (const match of allMatches) {
      if (courseMatchMap.has(match.courseId)) {
        // Found a duplicate - keep the most recent one
        const existingMatch = courseMatchMap.get(match.courseId);
        if (match.updatedAt > existingMatch.updatedAt) {
          // Current match is newer, deactivate the old one
          duplicatesToDeactivate.push(existingMatch._id);
          courseMatchMap.set(match.courseId, match);
        } else {
          // Existing match is newer, deactivate current one
          duplicatesToDeactivate.push(match._id);
        }
      } else {
        courseMatchMap.set(match.courseId, match);
      }
    }

    // Deactivate duplicate matches
    for (const duplicateId of duplicatesToDeactivate) {
      await ctx.db.patch(duplicateId, {
        isActive: false,
        updatedAt: now,
      });
    }

    return {
      newMatches,
      rematchedCourses,
      deactivatedMatches,
      duplicatesRemoved: duplicatesToDeactivate.length,
    };
  },
});

// Create manual match
export const createMatch = mutation({
  args: {
    courseId: v.id("courses"),
    lecturerId: v.id("lecturers"),
  },
  handler: async (ctx, args) => {
    // Check if match already exists
    const existingMatch = await ctx.db
      .query("matches")
      .filter((q) => 
        q.and(
          q.eq(q.field("courseId"), args.courseId),
          q.eq(q.field("lecturerId"), args.lecturerId)
        )
      )
      .first();

    if (existingMatch) {
      throw new Error("Match already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("matches", {
      courseId: args.courseId,
      lecturerId: args.lecturerId,
      isAutoMatched: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update match
export const updateMatch = mutation({
  args: {
    id: v.id("matches"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete match
export const deleteMatch = mutation({
  args: { id: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get matches by course
export const getMatchesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .collect();
  },
});

// Get matches by lecturer
export const getMatchesByLecturer = query({
  args: { lecturerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("lecturerId"), args.lecturerId))
      .collect();
  },
});

// Get active matches
export const getActiveMatches = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get unmatched courses (courses without lecturers)
export const getUnmatchedCourses = query({
  handler: async (ctx) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const unmatchedCourses = [];

    for (const course of courses) {
      // Check if course has an active match
      const existingMatch = await ctx.db
        .query("matches")
        .filter((q) => 
          q.and(
            q.eq(q.field("courseId"), course._id),
            q.eq(q.field("isActive"), true)
          )
        )
        .first();

      if (!existingMatch) {
        // Check if there are available lecturers for this specialization
        const availableLecturers = await ctx.db
          .query("lecturers")
          .filter((q) => 
            q.and(
              q.eq(q.field("availability"), true),
              q.eq(q.field("specialization"), course.specialization)
            )
          )
          .collect();

        unmatchedCourses.push({
          ...course,
          hasAvailableLecturers: availableLecturers.length > 0,
          availableLecturersCount: availableLecturers.length
        });
      }
    }

    return unmatchedCourses;
  },
});

// Clean up duplicate matches
export const cleanupDuplicateMatches = mutation({
  handler: async (ctx) => {
    // Get ALL matches (both active and inactive)
    const allMatches = await ctx.db
      .query("matches")
      .collect();

    const courseMatchMap = new Map();
    const duplicatesToDelete = [];
    const now = Date.now();

    // Group matches by courseId
    for (const match of allMatches) {
      if (!courseMatchMap.has(match.courseId)) {
        courseMatchMap.set(match.courseId, []);
      }
      courseMatchMap.get(match.courseId).push(match);
    }

    // For each course, keep only the best match and delete the rest
    for (const [courseId, courseMatches] of courseMatchMap) {
      if (courseMatches.length > 1) {
        // Sort by priority: Active > Inactive, then by most recent
        courseMatches.sort((a, b) => {
          if (a.isActive !== b.isActive) {
            return b.isActive - a.isActive; // Active first
          }
          return b.updatedAt - a.updatedAt; // Most recent first
        });

        // Keep the first (best) match, delete the rest
        const keepMatch = courseMatches[0];
        const deleteMatches = courseMatches.slice(1);
        
        duplicatesToDelete.push(...deleteMatches.map(m => m._id));
      }
    }

    // Delete duplicate matches
    for (const duplicateId of duplicatesToDelete) {
      await ctx.db.delete(duplicateId);
    }

    return {
      duplicatesRemoved: duplicatesToDelete.length,
    };
  },
});

// Rematch courses when lecturer becomes unavailable
export const rematchUnavailableLecturers = mutation({
  handler: async (ctx) => {
    // Get all active matches
    const activeMatches = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const rematchedCourses = [];
    const unmatchedCourses = [];

    for (const match of activeMatches) {
      // Get the lecturer for this match
      const lecturer = await ctx.db.get(match.lecturerId);
      
      // If lecturer is unavailable, try to rematch
      if (lecturer && !lecturer.availability) {
        // Deactivate the current match
        await ctx.db.patch(match._id, { 
          isActive: false,
          updatedAt: Date.now()
        });

        // Get the course
        const course = await ctx.db.get(match.courseId);
        if (!course) continue;

        // Find available lecturers for this course's specialization
        const availableLecturers = await ctx.db
          .query("lecturers")
          .filter((q) => 
            q.and(
              q.eq(q.field("availability"), true),
              q.eq(q.field("specialization"), course.specialization)
            )
          )
          .collect();

        if (availableLecturers.length > 0) {
          // Sort by experience and select the best one
          availableLecturers.sort((a, b) => b.experience - a.experience);
          const selectedLecturer = availableLecturers[0];

          // Create new match
          const newMatchId = await ctx.db.insert("matches", {
            courseId: course._id,
            lecturerId: selectedLecturer._id,
            isAutoMatched: true,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          rematchedCourses.push({
            courseId: course._id,
            oldLecturerId: match.lecturerId,
            newLecturerId: selectedLecturer._id,
            newMatchId,
          });
        } else {
          // No available lecturers for this specialization
          unmatchedCourses.push({
            courseId: course._id,
            specialization: course.specialization,
          });
        }
      }
    }

    return {
      rematchedCourses,
      unmatchedCourses,
    };
  },
});

