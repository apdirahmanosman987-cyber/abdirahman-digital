import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}

export async function logAudit(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  req?: NextRequest;
}) {
  const ipAddress = params.req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata as any,
      ipAddress,
    },
  });
}
