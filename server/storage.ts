import { 
  users, courses, lessons, enrollments, progress, reviews,
  type User, type InsertUser, type Course, type InsertCourse, 
  type Lesson, type InsertLesson, type Enrollment, type InsertEnrollment,
  type Progress, type InsertProgress, type Review, type InsertReview,
  UserRole, CourseStatus
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private lessons: Map<number, Lesson>;
  private enrollments: Map<number, Enrollment>;
  private progress: Map<number, Progress>;
  private reviews: Map<number, Review>;
  
  sessionStore: session.SessionStore;
  
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

export const storage = new MemStorage();
