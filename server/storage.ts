import { 
  users, courses, lessons, enrollments, progress, reviews,
  type User, type InsertUser, type Course, type InsertCourse, 
  type Lesson, type InsertLesson, type Enrollment, type InsertEnrollment,
  type Progress, type InsertProgress, type Review, type InsertReview,
  UserRole, CourseStatus
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Courses
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByTeacher(teacherId: number): Promise<Course[]>;
  getAllCourses(status?: string): Promise<Course[]>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

  // Lessons
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByCourse(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson | undefined>;
  deleteLesson(id: number): Promise<boolean>;

  // Enrollments
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  updateEnrollment(id: number, enrollment: Partial<Enrollment>): Promise<Enrollment | undefined>;

  // Progress
  createProgress(progress: InsertProgress): Promise<Progress>;
  getProgressByStudent(studentId: number): Promise<Progress[]>;
  updateProgress(id: number, progress: Partial<Progress>): Promise<Progress | undefined>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByCourse(courseId: number): Promise<Review[]>;
  
  // Session store
  sessionStore: session.Store; // Use session.Store interface
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private lessons: Map<number, Lesson>;
  private enrollments: Map<number, Enrollment>;
  private progress: Map<number, Progress>;
  private reviews: Map<number, Review>;
  
  sessionStore: session.Store;
  
  private userId: number = 1;
  private courseId: number = 1;
  private lessonId: number = 1;
  private enrollmentId: number = 1;
  private progressId: number = 1;
  private reviewId: number = 1;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.lessons = new Map();
    this.enrollments = new Map();
    this.progress = new Map();
    this.reviews = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Create admin user by default
    this.createUser({
      username: "admin",
      email: "admin@learnhub.com",
      password: "admin123", // This will be hashed in auth.ts
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      bio: "Platform administrator",
      profilePicUrl: "https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Courses
  async createCourse(courseData: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const now = new Date();
    const course: Course = { 
      ...courseData, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.courses.set(id, course);
    return course;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      course => course.teacherId === teacherId
    );
  }

  async getAllCourses(status?: string): Promise<Course[]> {
    let courses = Array.from(this.courses.values());
    
    if (status) {
      courses = courses.filter(course => course.status === status);
    }
    
    return courses;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { 
      ...course, 
      ...courseData,
      updatedAt: new Date()
    };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Lessons
  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const id = this.lessonId++;
    const lesson: Lesson = { 
      ...lessonData, 
      id,
      createdAt: new Date()
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;
    
    const updatedLesson = { ...lesson, ...lessonData };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }

  async deleteLesson(id: number): Promise<boolean> {
    return this.lessons.delete(id);
  }

  // Enrollments
  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentId++;
    const enrollment: Enrollment = { 
      ...enrollmentData, 
      id,
      enrolledAt: new Date(),
      lastAccessed: new Date()
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      enrollment => enrollment.studentId === studentId && enrollment.courseId === courseId
    );
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.studentId === studentId
    );
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.courseId === courseId
    );
  }

  async updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;
    
    const updatedEnrollment = { ...enrollment, ...enrollmentData };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Progress
  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const id = this.progressId++;
    const progress: Progress = { 
      ...progressData, 
      id,
      createdAt: new Date(),
      completedAt: progressData.completed ? new Date() : undefined
    };
    this.progress.set(id, progress);
    return progress;
  }

  async getProgressByStudent(studentId: number): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(
      progress => progress.studentId === studentId
    );
  }

  async updateProgress(id: number, progressData: Partial<Progress>): Promise<Progress | undefined> {
    const progress = this.progress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { 
      ...progress, 
      ...progressData,
      completedAt: progressData.completed ? new Date() : progress.completedAt
    };
    this.progress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Reviews
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { 
      ...reviewData, 
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async getReviewsByCourse(courseId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.courseId === courseId
    );
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool, 
      createTableIfMissing: true
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Courses
  async createCourse(courseData: InsertCourse): Promise<Course> {
    const result = await db.insert(courses).values(courseData).returning();
    return result[0];
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const result = await db.select().from(courses).where(eq(courses.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.teacherId, teacherId))
      .orderBy(desc(courses.createdAt));
  }

  async getAllCourses(status?: string): Promise<Course[]> {
    if (status) {
      return await db
        .select()
        .from(courses)
        .where(eq(courses.status, status as any))
        .orderBy(desc(courses.createdAt));
    }
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const result = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteCourse(id: number): Promise<boolean> {
    await db.delete(courses).where(eq(courses.id, id));
    return true;
  }

  // Lessons
  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const result = await db.insert(lessons).values(lessonData).returning();
    return result[0];
  }

  async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const result = await db.select().from(lessons).where(eq(lessons.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async updateLesson(id: number, lessonData: Partial<Lesson>): Promise<Lesson | undefined> {
    const result = await db
      .update(lessons)
      .set(lessonData)
      .where(eq(lessons.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteLesson(id: number): Promise<boolean> {
    await db.delete(lessons).where(eq(lessons.id, id));
    return true;
  }

  // Enrollments
  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const result = await db.insert(enrollments).values(enrollmentData).returning();
    return result[0];
  }

  async getEnrollment(studentId: number, courseId: number): Promise<Enrollment | undefined> {
    const result = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.courseId, courseId)
      ));
    return result.length > 0 ? result[0] : undefined;
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }

  async updateEnrollment(id: number, enrollmentData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const result = await db
      .update(enrollments)
      .set(enrollmentData)
      .where(eq(enrollments.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Progress tracking
  async createProgress(progressData: InsertProgress): Promise<Progress> {
    // Explicitly referring to the imported progress
    const progressTable = progress;
    const result = await db.insert(progressTable).values(progressData).returning();
    return result[0];
  }

  async getProgressByStudent(studentId: number): Promise<Progress[]> {
    // Explicitly referring to the imported progress
    const progressTable = progress;
    return await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.studentId, studentId));
  }

  async updateProgress(id: number, progressData: Partial<Progress>): Promise<Progress | undefined> {
    // Explicitly referring to the imported progress
    const progressTable = progress;
    const result = await db
      .update(progressTable)
      .set(progressData)
      .where(eq(progressTable.id, id))
      .returning();
    return result.length > 0 ? result[0] : undefined;
  }

  // Reviews
  async createReview(reviewData: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(reviewData).returning();
    return result[0];
  }

  async getReviewsByCourse(courseId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.courseId, courseId));
  }
}

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
