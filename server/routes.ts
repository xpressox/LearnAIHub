import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertCourseSchema, 
  insertLessonSchema, 
  insertEnrollmentSchema,
  insertProgressSchema,
  insertReviewSchema,
  CourseStatus,
  UserRole
} from "@shared/schema";
import { 
  generateSummary, 
  generateQuizQuestions,
  generateStudyNotes,
  generateLessonPlan,
  generateCustomContent
} from "./openai";
import { z } from "zod";

// Auth middleware
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based middleware
function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User routes
  app.get(
    "/api/users", 
    requireRole([UserRole.ADMIN]), 
    async (req, res) => {
      try {
        const users = await storage.getAllUsers();
        
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        
        res.json(usersWithoutPasswords);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error });
      }
    }
  );

  app.get(
    "/api/users/role/:role", 
    requireRole([UserRole.ADMIN, UserRole.TEACHER]), 
    async (req, res) => {
      try {
        const { role } = req.params;
        const users = await storage.getUsersByRole(role);
        
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        
        res.json(usersWithoutPasswords);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users by role", error });
      }
    }
  );

  // Course routes
  app.post(
    "/api/courses", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]), 
    async (req, res) => {
      try {
        const validationResult = insertCourseSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationResult.error.errors 
          });
        }
        
        const course = await storage.createCourse(req.body);
        res.status(201).json(course);
      } catch (error) {
        res.status(500).json({ message: "Failed to create course", error });
      }
    }
  );

  app.get("/api/courses", async (req, res) => {
    try {
      const { status } = req.query;
      
      // By default, only return published courses to non-admin/non-teachers
      let statusFilter: string | undefined;
      
      if (req.isAuthenticated() && [UserRole.ADMIN, UserRole.TEACHER].includes(req.user.role)) {
        statusFilter = status as string;
      } else {
        statusFilter = CourseStatus.PUBLISHED;
      }
      
      const courses = await storage.getAllCourses(statusFilter);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses", error });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Only allow teachers/admins to see unpublished courses
      if (course.status !== CourseStatus.PUBLISHED) {
        if (!req.isAuthenticated() || 
            (req.user.role !== UserRole.ADMIN && 
             (req.user.role !== UserRole.TEACHER || req.user.id !== course.teacherId))) {
          return res.status(403).json({ message: "Permission denied" });
        }
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course", error });
    }
  });

  app.get(
    "/api/teachers/:id/courses", 
    async (req, res) => {
      try {
        const teacherId = parseInt(req.params.id);
        
        // Determine which courses to show based on user role
        let courses = await storage.getCoursesByTeacher(teacherId);
        
        if (!req.isAuthenticated() || 
            (req.user.role !== UserRole.ADMIN && 
             (req.user.role !== UserRole.TEACHER || req.user.id !== teacherId))) {
          // Filter to only published courses for non-owners
          courses = courses.filter(course => course.status === CourseStatus.PUBLISHED);
        }
        
        res.json(courses);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch teacher courses", error });
      }
    }
  );

  app.put(
    "/api/courses/:id", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]), 
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.id);
        const course = await storage.getCourse(courseId);
        
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        // Check if user has permission (admin or course owner)
        if (req.user.role !== UserRole.ADMIN && req.user.id !== course.teacherId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const updatedCourse = await storage.updateCourse(courseId, req.body);
        res.json(updatedCourse);
      } catch (error) {
        res.status(500).json({ message: "Failed to update course", error });
      }
    }
  );

  app.delete(
    "/api/courses/:id", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]), 
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.id);
        const course = await storage.getCourse(courseId);
        
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        // Check if user has permission (admin or course owner)
        if (req.user.role !== UserRole.ADMIN && req.user.id !== course.teacherId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        await storage.deleteCourse(courseId);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: "Failed to delete course", error });
      }
    }
  );

  // Lesson routes
  app.post(
    "/api/lessons", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]), 
    async (req, res) => {
      try {
        const validationResult = insertLessonSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationResult.error.errors 
          });
        }
        
        const course = await storage.getCourse(req.body.courseId);
        
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        // Check if user has permission (admin or course owner)
        if (req.user.role !== UserRole.ADMIN && req.user.id !== course.teacherId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const lesson = await storage.createLesson(req.body);
        res.status(201).json(lesson);
      } catch (error) {
        res.status(500).json({ message: "Failed to create lesson", error });
      }
    }
  );

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if user has permission to view unpublished course lessons
      if (course.status !== CourseStatus.PUBLISHED) {
        if (!req.isAuthenticated() || 
            (req.user.role !== UserRole.ADMIN && 
             (req.user.role !== UserRole.TEACHER || req.user.id !== course.teacherId))) {
          return res.status(403).json({ message: "Permission denied" });
        }
      }
      
      const lessons = await storage.getLessonsByCourse(courseId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons", error });
    }
  });

  // Enrollment routes
  app.post(
    "/api/enrollments", 
    requireAuth, 
    async (req, res) => {
      try {
        const validationResult = insertEnrollmentSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationResult.error.errors 
          });
        }
        
        // Check if student is enrolling themselves
        if (req.user.role === UserRole.STUDENT && req.user.id !== req.body.studentId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        // Check if already enrolled
        const existing = await storage.getEnrollment(req.body.studentId, req.body.courseId);
        if (existing) {
          return res.status(400).json({ message: "Already enrolled in this course" });
        }
        
        const enrollment = await storage.createEnrollment(req.body);
        res.status(201).json(enrollment);
      } catch (error) {
        res.status(500).json({ message: "Failed to create enrollment", error });
      }
    }
  );

  app.get(
    "/api/students/:id/enrollments", 
    requireAuth,
    async (req, res) => {
      try {
        const studentId = parseInt(req.params.id);
        
        // Check if user has permission
        if (req.user.role === UserRole.STUDENT && req.user.id !== studentId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const enrollments = await storage.getEnrollmentsByStudent(studentId);
        
        // Get full course data for each enrollment
        const results = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = await storage.getCourse(enrollment.courseId);
            return {
              ...enrollment,
              course,
            };
          })
        );
        
        res.json(results);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch enrollments", error });
      }
    }
  );

  app.put(
    "/api/enrollments/:id", 
    requireAuth,
    async (req, res) => {
      try {
        const enrollmentId = parseInt(req.params.id);
        const enrollment = await storage.updateEnrollment(enrollmentId, {
          ...req.body,
          lastAccessed: new Date(),
        });
        
        if (!enrollment) {
          return res.status(404).json({ message: "Enrollment not found" });
        }
        
        res.json(enrollment);
      } catch (error) {
        res.status(500).json({ message: "Failed to update enrollment", error });
      }
    }
  );

  // Progress routes
  app.post(
    "/api/progress", 
    requireAuth,
    async (req, res) => {
      try {
        const validationResult = insertProgressSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationResult.error.errors 
          });
        }
        
        // Check if student is updating their own progress
        if (req.user.role === UserRole.STUDENT && req.user.id !== req.body.studentId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const progress = await storage.createProgress(req.body);
        res.status(201).json(progress);
      } catch (error) {
        res.status(500).json({ message: "Failed to create progress record", error });
      }
    }
  );

  app.get(
    "/api/students/:id/progress", 
    requireAuth,
    async (req, res) => {
      try {
        const studentId = parseInt(req.params.id);
        
        // Check if user has permission
        if (req.user.role === UserRole.STUDENT && req.user.id !== studentId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const progress = await storage.getProgressByStudent(studentId);
        res.json(progress);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch progress", error });
      }
    }
  );

  // Review routes
  app.post(
    "/api/reviews", 
    requireAuth,
    async (req, res) => {
      try {
        const validationResult = insertReviewSchema.safeParse(req.body);
        
        if (!validationResult.success) {
          return res.status(400).json({ 
            message: "Validation error", 
            errors: validationResult.error.errors 
          });
        }
        
        // Check if student is adding their own review
        if (req.user.role === UserRole.STUDENT && req.user.id !== req.body.studentId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const review = await storage.createReview(req.body);
        res.status(201).json(review);
      } catch (error) {
        res.status(500).json({ message: "Failed to create review", error });
      }
    }
  );

  app.get("/api/courses/:id/reviews", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByCourse(courseId);
      
      // Get user information for each review
      const results = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.studentId);
          return {
            ...review,
            user: user ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              profilePicUrl: user.profilePicUrl,
            } : null,
          };
        })
      );
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error });
    }
  });

  // AI Content Generation routes
  app.post(
    "/api/ai/generate-summary", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]),
    async (req, res) => {
      try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
          return res.status(400).json({ message: "Text content is required" });
        }
        
        const summary = await generateSummary(text);
        res.json({ summary });
      } catch (error) {
        res.status(500).json({ message: "Failed to generate summary", error });
      }
    }
  );

  app.post(
    "/api/ai/generate-quiz", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]),
    async (req, res) => {
      try {
        const { text, numberOfQuestions } = req.body;
        
        if (!text || typeof text !== 'string') {
          return res.status(400).json({ message: "Text content is required" });
        }
        
        const questionsCount = numberOfQuestions || 5;
        const quiz = await generateQuizQuestions(text, questionsCount);
        res.json(quiz);
      } catch (error) {
        res.status(500).json({ message: "Failed to generate quiz", error });
      }
    }
  );

  app.post(
    "/api/ai/generate-notes", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]),
    async (req, res) => {
      try {
        const { text } = req.body;
        
        if (!text || typeof text !== 'string') {
          return res.status(400).json({ message: "Text content is required" });
        }
        
        const notes = await generateStudyNotes(text);
        res.json({ notes });
      } catch (error) {
        res.status(500).json({ message: "Failed to generate study notes", error });
      }
    }
  );

  app.post(
    "/api/ai/generate-lesson-plan", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]),
    async (req, res) => {
      try {
        const { topic, duration } = req.body;
        
        if (!topic || typeof topic !== 'string') {
          return res.status(400).json({ message: "Topic is required" });
        }
        
        const lessonPlan = await generateLessonPlan(topic, duration);
        res.json({ lessonPlan });
      } catch (error) {
        res.status(500).json({ message: "Failed to generate lesson plan", error });
      }
    }
  );

  app.post(
    "/api/ai/generate-custom", 
    requireRole([UserRole.TEACHER, UserRole.ADMIN]),
    async (req, res) => {
      try {
        const { instructions, reference } = req.body;
        
        if (!instructions || typeof instructions !== 'string') {
          return res.status(400).json({ message: "Instructions are required" });
        }
        
        const content = await generateCustomContent(instructions, reference);
        res.json({ content });
      } catch (error) {
        res.status(500).json({ message: "Failed to generate custom content", error });
      }
    }
  );

  // Analytics routes
  app.get(
    "/api/analytics/overview", 
    requireRole([UserRole.ADMIN]),
    async (req, res) => {
      try {
        const students = await storage.getUsersByRole(UserRole.STUDENT);
        const teachers = await storage.getUsersByRole(UserRole.TEACHER);
        const courses = await storage.getAllCourses();
        
        // Count published courses
        const publishedCourses = courses.filter(course => course.status === CourseStatus.PUBLISHED);
        
        // Total enrollments
        const enrollments = Array.from(
          await Promise.all(students.map(student => storage.getEnrollmentsByStudent(student.id)))
        ).flat();
        
        // Calculate completion rates
        const completedEnrollments = enrollments.filter(enrollment => enrollment.completed);
        const completionRate = enrollments.length > 0 
          ? (completedEnrollments.length / enrollments.length) * 100 
          : 0;
        
        // Monthly data for charts
        const currentDate = new Date();
        const monthlyData: any = {};
        
        // Mock monthly data (this would normally be calculated from actual data)
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
          
          monthlyData[monthKey] = {
            students: Math.floor(students.length * (0.8 + Math.random() * 0.4)),
            enrollments: Math.floor(enrollments.length * (0.7 + Math.random() * 0.5)),
            completionRate: Math.floor(completionRate * (0.8 + Math.random() * 0.4)),
          };
        }
        
        res.json({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalCourses: courses.length,
          publishedCourses: publishedCourses.length,
          totalEnrollments: enrollments.length,
          completedEnrollments: completedEnrollments.length,
          completionRate,
          monthlyData,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch analytics", error });
      }
    }
  );

  app.get(
    "/api/analytics/teacher/:id", 
    requireAuth,
    async (req, res) => {
      try {
        const teacherId = parseInt(req.params.id);
        
        // Check if teacher is viewing their own analytics or admin is viewing
        if (req.user.role === UserRole.TEACHER && req.user.id !== teacherId) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        const courses = await storage.getCoursesByTeacher(teacherId);
        
        // Get enrollments for each course
        let totalStudents = 0;
        const courseEnrollments = await Promise.all(
          courses.map(async course => {
            const enrollments = await storage.getEnrollmentsByCourse(course.id);
            totalStudents += enrollments.length;
            return {
              courseId: course.id,
              title: course.title,
              enrollments: enrollments.length,
              completed: enrollments.filter(e => e.completed).length,
            };
          })
        );
        
        // Get overall completion rate
        const completionRate = courseEnrollments.reduce(
          (acc, course) => {
            return {
              total: acc.total + course.enrollments,
              completed: acc.completed + course.completed
            };
          }, 
          { total: 0, completed: 0 }
        );
        
        const overallCompletionRate = completionRate.total > 0 
          ? (completionRate.completed / completionRate.total) * 100 
          : 0;
        
        res.json({
          totalCourses: courses.length,
          publishedCourses: courses.filter(c => c.status === CourseStatus.PUBLISHED).length,
          totalStudents,
          completionRate: overallCompletionRate,
          courseData: courseEnrollments,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch teacher analytics", error });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
