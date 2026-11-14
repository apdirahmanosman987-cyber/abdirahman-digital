import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WEBP, or GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Max size is 8MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${crypto.randomUUID()}.webp`;

  // NOTE: this dev implementation writes to local disk and optimizes with sharp.
  // For production, swap this for an object storage upload (Vercel Blob, S3, R2)
  // and store the resulting public URL the same way below.
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const optimized = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const metadata = await sharp(optimized).metadata();
  await writeFile(path.join(uploadDir, key), optimized);

  const media = await prisma.media.create({
    data: {
      url: `/uploads/${key}`,
      key,
      altText,
      width: metadata.width,
      height: metadata.height,
      size: optimized.length,
      mimeType: "image/webp",
    },
  });

  return NextResponse.json({ media });
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ media });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing media id" }, { status: 400 });

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
