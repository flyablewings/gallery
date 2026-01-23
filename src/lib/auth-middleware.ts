import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  profileImage?: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return null;
}