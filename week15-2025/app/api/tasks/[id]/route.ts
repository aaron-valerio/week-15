import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await prisma.task.update({ where: { id: Number(id) }, data: { title: body.title, category: body.category, status: body.status } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Read-only di Vercel" }, { status: 500 });
  }
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Read-only di Vercel" }, { status: 500 });
  }
}
