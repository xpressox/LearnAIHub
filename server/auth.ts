import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserRole } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Added safety check for missing or malformed stored password
  if (!stored || !stored.includes('.')) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Create default users if they don't exist
export async function ensureDefaultUsers() {
  try {
    // Check and create admin user
    const adminUser = await storage.getUserByUsername('admin');
    if (!adminUser) {
      console.log('Creating default admin user...');
      await storage.createUser({
        username: 'admin',
        email: 'admin@dentallearnhub.com',
        password: await hashPassword('admin123'),
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        bio: 'Platform administrator',
        profilePicUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=32CD32&color=fff'
      });
      console.log('Default admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
    
    // Check and create teacher user
    const teacherUser = await storage.getUserByUsername('teacher');
    if (!teacherUser) {
      console.log('Creating default teacher user...');
      await storage.createUser({
        username: 'teacher',
        email: 'teacher@dentallearnhub.com',
        password: await hashPassword('teacher123'),
        firstName: 'Dr. Vikram',
        lastName: 'Singh',
        role: UserRole.TEACHER,
        bio: 'BDS, MDS (Oral & Maxillofacial Surgery) from King George\'s Medical University',
        profilePicUrl: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=32CD32&color=fff'
      });
      console.log('Default teacher user created successfully.');
    }
    
    // Check and create student user
    const studentUser = await storage.getUserByUsername('student');
    if (!studentUser) {
      console.log('Creating default student user...');
      await storage.createUser({
        username: 'student',
        email: 'student@dentallearnhub.com',
        password: await hashPassword('student123'),
        firstName: 'Rahul',
        lastName: 'Sharma',
        role: UserRole.STUDENT,
        bio: 'BDS student at Manipal College of Dental Sciences',
        profilePicUrl: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=32CD32&color=fff'
      });
      console.log('Default student user created successfully.');
    }
  } catch (error) {
    console.error('Error ensuring default users:', error);
  }
}

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]).default(UserRole.STUDENT),
});

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || 'learnhub-secret-key-dev';
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Ensure default users exist (admin, teacher, student)
  ensureDefaultUsers();

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if the input is an email
        const isEmail = username.includes('@');
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate input
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.errors 
        });
      }
      
      const { email, username } = req.body;
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
        profilePicUrl: req.body.profilePicUrl || `https://ui-avatars.com/api/?name=${req.body.firstName}+${req.body.lastName}&background=3B82F6&color=fff`,
      });

      // Log in the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}
