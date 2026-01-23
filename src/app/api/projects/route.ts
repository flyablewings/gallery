import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, category, description, year, images } = body;

  if (!title || !category || !description || !year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      title,
      category,
      description,
      year,
      images: {
        create: images || []
      }
    },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return NextResponse.json(project, { status: 201 });
}
