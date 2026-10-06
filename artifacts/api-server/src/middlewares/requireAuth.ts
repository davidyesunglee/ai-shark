import type { RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db, users, type User } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      dbUser?: User;
    }
  }
}

// Preserve the existing session-to-local-user ID bridge, including legacy IDs.
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userId = auth.sessionClaims?.userId;
    if (typeof userId !== "string" || !userId) {
      res.status(403).json({ message: "Account identity is unavailable. Please contact support." });
      return;
    }
    let [dbUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!dbUser) {
      const email = auth.sessionClaims?.email;
      if (typeof email !== "string" || !email) {
        res.status(403).json({ message: "An email address is required for this account." });
        return;
      }
      // Frozen insert-only email satisfies the existing NOT NULL constraint.
      // This sentinel is not a password hash: Clerk is the only password verifier.
      const [inserted] = await db.insert(users).values({
        id: userId,
        email: email.toLowerCase(),
        passwordHash: "!clerk-managed",
      }).onConflictDoNothing().returning();
      dbUser = inserted;
      if (!dbUser) {
        [dbUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      }
    }
    if (!dbUser) {
      res.status(403).json({ message: "Account access could not be resolved. Please contact support." });
      return;
    }
    req.dbUser = dbUser;
    next();
  } catch (error) {
    req.log.error({ err: error }, "Could not resolve authenticated account");
    next(error);
  }
};