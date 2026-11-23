import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task = await prisma.task.create({ data: { title: body.title, category: body.category, status: body.status || "Pending" } });
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Read-only di Vercel" }, { status: 500 });
  }
}
