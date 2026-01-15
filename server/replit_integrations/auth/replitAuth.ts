import session from "express-session";
import type { Express, Response, NextFunction } from "express";
import { Request } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { signupSchema, loginSchema } from "@shared/models/auth";
import { Resend } from "resend";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export function getSession() {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for session store");
  }
  
  console.log("[Session] Initializing with DATABASE_URL");
  
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const isProduction = process.env.NODE_ENV === "production";
  
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Hydrate req.user from session
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      const user = await authStorage.getUser(req.session.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
        };
      }
    }
    next();
  });

  // Signup endpoint
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      console.log("[Auth Signup] Attempt from:", req.get("host"), "Protocol:", req.protocol, "Secure:", req.secure);
      console.log("[Auth Signup] NODE_ENV:", process.env.NODE_ENV);
      
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        console.log("[Auth Signup] Validation failed:", result.error.errors[0].message);
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, password, firstName, lastName } = result.data;
      console.log("[Auth Signup] Attempting signup for:", email);

      // Check if user exists
      let existing;
      try {
        existing = await authStorage.getUserByEmail(email);
      } catch (dbErr: any) {
        console.error("[Auth Signup] DB error checking existing user:", dbErr.message, dbErr.stack);
        return res.status(500).json({ 
          message: "Failed to create account", 
          detail: "database check error",
          errorType: dbErr.name,
          errorMessage: dbErr.message
        });
      }
      
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user
      let user;
      try {
        user = await authStorage.createUser({ email, password, firstName, lastName });
        console.log("[Auth Signup] User created:", user.id);
      } catch (createErr: any) {
        console.error("[Auth Signup] Error creating user:", createErr.message, createErr.stack);
        return res.status(500).json({ 
          message: "Failed to create account", 
          detail: "user creation error",
          errorType: createErr.name,
          errorMessage: createErr.message
        });
      }

      // Create verification token and send email
      try {
        const token = await authStorage.createVerificationToken(user.id);
        const verifyUrl = `${req.protocol}://${req.get("host")}/verify-email?token=${token}`;

        await resend.emails.send({
          from: "AI Shark <noreply@aishark.org>",
          to: email,
          subject: "Verify your AI Shark account",
          html: `
            <h2>Welcome to AI Shark!</h2>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verifyUrl}">Verify Email</a></p>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't create this account, you can ignore this email.</p>
          `,
        });
      } catch (emailErr: any) {
        console.error("[Auth Signup] Failed to send verification email:", emailErr.message);
      }

      // Log user in
      req.session.userId = user.id;
      
      // Save session before responding
      req.session.save((err) => {
        if (err) {
          console.error("[Auth Signup] Session save error:", err.message, err.stack);
          return res.status(500).json({ 
            message: "Failed to create session",
            detail: "session save error",
            errorType: err.name,
            errorMessage: err.message
          });
        }
        console.log("[Auth Signup] Session saved for:", user.id);
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
        });
      });
    } catch (error: any) {
      console.error("[Auth Signup] Unexpected error:", error.message, error.stack);
      res.status(500).json({ 
        message: "Failed to create account",
        detail: "unexpected error",
        errorType: error.name,
        errorMessage: error.message
      });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      console.log("[Auth Login] Attempt from:", req.get("host"), "Protocol:", req.protocol, "Secure:", req.secure);
      console.log("[Auth Login] NODE_ENV:", process.env.NODE_ENV);
      console.log("[Auth Login] Session config - secure:", process.env.NODE_ENV === "production");
      
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        console.log("[Auth Login] Validation failed:", result.error.errors[0].message);
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, password } = result.data;
      console.log("[Auth Login] Attempting login for:", email);

      let user;
      try {
        user = await authStorage.verifyPassword(email, password);
      } catch (verifyErr: any) {
        console.error("[Auth Login] verifyPassword threw:", verifyErr.message, verifyErr.stack);
        return res.status(500).json({ 
          message: "Login failed", 
          detail: "password verification error",
          errorType: verifyErr.name || "Unknown",
          errorMessage: verifyErr.message || "No message"
        });
      }
      
      if (!user) {
        console.log("[Auth Login] Invalid credentials for:", email);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      console.log("[Auth Login] User verified:", user.id);

      // Update last login
      try {
        await authStorage.updateLastLogin(user.id);
      } catch (updateErr: any) {
        console.error("[Auth Login] updateLastLogin threw:", updateErr.message);
      }

      // Set session
      req.session.userId = user.id;

      // Save session before responding
      req.session.save((err) => {
        if (err) {
          console.error("[Auth Login] Session save error:", err.message, err.stack);
          return res.status(500).json({ message: "Failed to create session", detail: "session save error" });
        }
        console.log("[Auth Login] Session saved successfully for:", user.id);
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
        });
      });
    } catch (error: any) {
      console.error("[Auth Login] Unexpected error:", error.message, error.stack);
      res.status(500).json({ message: "Login failed", detail: error.message });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("[Auth Logout] Error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // Verify email
  app.get("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid token" });
      }

      const success = await authStorage.verifyEmail(token);
      if (!success) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      console.error("[Auth Verify] Error:", error);
      res.status(500).json({ message: "Verification failed" });
    }
  });

  // Resend verification email
  app.post("/api/auth/resend-verification", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await authStorage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const token = await authStorage.createVerificationToken(user.id);
      const verifyUrl = `${req.protocol}://${req.get("host")}/verify-email?token=${token}`;

      await resend.emails.send({
        from: "AI Shark <noreply@aishark.org>",
        to: user.email,
        subject: "Verify your AI Shark account",
        html: `
          <h2>Verify your email</h2>
          <p>Please verify your email by clicking the link below:</p>
          <p><a href="${verifyUrl}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
        `,
      });

      res.json({ message: "Verification email sent" });
    } catch (error: any) {
      console.error("[Auth Resend] Error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
