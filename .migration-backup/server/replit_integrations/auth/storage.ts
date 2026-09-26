import { users, emailVerificationTokens, type User, type SignupInput } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(input: SignupInput): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  updateLastLogin(userId: string): Promise<void>;
  createVerificationToken(userId: string): Promise<string>;
  verifyEmail(token: string): Promise<boolean>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    return user;
  }

  async createUser(input: SignupInput): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, 12);
    const [user] = await db
      .insert(users)
      .values({
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
      })
      .returning();
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    console.log("[AuthStorage] verifyPassword called for:", email);
    let user;
    try {
      user = await this.getUserByEmail(email);
      console.log("[AuthStorage] User found:", !!user);
    } catch (dbErr: any) {
      console.error("[AuthStorage] Database error getting user:", dbErr.message, dbErr.stack);
      throw dbErr;
    }
    
    if (!user) return null;
    
    console.log("[AuthStorage] passwordHash exists:", !!user.passwordHash);
    console.log("[AuthStorage] passwordHash length:", user.passwordHash?.length);
    
    try {
      const valid = await bcrypt.compare(password, user.passwordHash);
      console.log("[AuthStorage] Password valid:", valid);
      return valid ? user : null;
    } catch (bcryptErr: any) {
      console.error("[AuthStorage] bcrypt.compare error:", bcryptErr.message, bcryptErr.stack);
      throw bcryptErr;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createVerificationToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await db.insert(emailVerificationTokens).values({
      userId,
      token,
      expiresAt,
    });
    return token;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const [tokenRecord] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));
    
    if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
      return false;
    }

    await db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(emailVerificationTokens.id, tokenRecord.id));

    await db
      .update(users)
      .set({ emailVerified: true, emailVerifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, tokenRecord.userId));

    return true;
  }
}

export const authStorage = new AuthStorage();
