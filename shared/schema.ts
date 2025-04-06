import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles
export const UserRole = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").$type<UserRoleType>().notNull().default('student'),
  bio: text("bio"),
  profilePicUrl: text("profile_pic_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
  bio: true,
  profilePicUrl: true,
});

// Course category
export const CourseCategory = {
  PROGRAMMING: 'Programming',
  DESIGN: 'Design',
  DATA_SCIENCE: 'Data Science',
  BUSINESS: 'Business',
  MARKETING: 'Marketing',
  AI_ML: 'AI & Machine Learning',
  CRYPTOCURRENCY: 'Cryptocurrency'
} as const;

export type CourseCategoryType = typeof CourseCategory[keyof typeof CourseCategory];

// Course status
export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

export type CourseStatusType = typeof CourseStatus[keyof typeof CourseStatus];

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").$type<CourseCategoryType>().notNull(),
  teacherId: integer("teacher_id").notNull(),
  price: doublePrecision("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(true),
  thumbnailUrl: text("thumbnail_url"),
  status: text("status").$type<CourseStatusType>().notNull().default('draft'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  category: true,
  teacherId: true,
  price: true,
  isFree: true,
  thumbnailUrl: true,
  status: true,
});

// Lesson content type
export const ContentType = {
  VIDEO: 'video',
  PDF: 'pdf',
  PRESENTATION: 'presentation',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  AI_GENERATED: 'ai_generated',
} as const;

export type ContentTypeValue = typeof ContentType[keyof typeof ContentType];

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  courseId: integer("course_id").notNull(),
  contentType: text("content_type").$type<ContentTypeValue>().notNull(),
  contentUrl: text("content_url").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  title: true,
  courseId: true,
  contentType: true,
  contentUrl: true,
  order: true,
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completed: boolean("completed").notNull().default(false),
  completionPercentage: integer("completion_percentage").notNull().default(0),
  lastAccessed: timestamp("last_accessed"),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  studentId: true,
  courseId: true,
  completed: true,
  completionPercentage: true,
});

// Progress tracking
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  studentId: true,
  lessonId: true,
  completed: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  studentId: true,
  courseId: true,
  rating: true,
  comment: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
