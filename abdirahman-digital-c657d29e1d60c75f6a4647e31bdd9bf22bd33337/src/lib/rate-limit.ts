import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Checks how many failed login attempts have occurred for this email/IP
 * combination in the current window. Used to brute-force-protect /admin login.
 */
export async function isLoginRateLimited(email: string, ipAddress: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);

  const [byEmail, byIp] = await Promise.all([
    prisma.loginAttempt.count({
      where: { email, success: false, createdAt: { gte: since } },
    }),
    prisma.loginAttempt.count({
      where: { ipAddress, success: false, createdAt: { gte: since } },
    }),
  ]);

  return byEmail >= MAX_ATTEMPTS || byIp >= MAX_ATTEMPTS * 4;
}

export async function recordLoginAttempt(params: {
  email: string;
  ipAddress: string;
  success: boolean;
  userAgent?: string;
  userId?: string;
}) {
  await prisma.loginAttempt.create({
    data: {
      email: params.email,
      ipAddress: params.ipAddress,
      success: params.success,
      userAgent: params.userAgent,
      userId: params.userId,
    },
  });
}

// Simple sliding-window limiter for public endpoints (e.g. contact form) that
// don't need persistence across restarts.
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

export function isMemoryRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
