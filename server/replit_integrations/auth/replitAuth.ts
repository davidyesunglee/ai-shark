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
  
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
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
      secure: process.env.NODE_ENV === "production",
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
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, password, firstName, lastName } = result.data;

      // Check if user exists
      const existing = await authStorage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user
      const user = await authStorage.createUser({ email, password, firstName, lastName });

      // Create verification token and send email
      const token = await authStorage.createVerificationToken(user.id);
      const verifyUrl = `${req.protocol}://${req.get("host")}/verify-email?token=${token}`;

      try {
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
      } catch (emailErr) {
        console.error("[Auth] Failed to send verification email:", emailErr);
      }

      // Log user in
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      });
    } catch (error: any) {
      console.error("[Auth Signup] Error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const { email, password } = result.data;

      const user = await authStorage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update last login
      await authStorage.updateLastLogin(user.id);

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      });
    } catch (error: any) {
      console.error("[Auth Login] Error:", error);
      res.status(500).json({ message: "Login failed" });
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
