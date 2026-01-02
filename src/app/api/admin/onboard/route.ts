import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  const exists = await Admin.findOne({ email }).lean();
  if (exists) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const created = await Admin.create({ email, passwordHash: hash, role: "admin" });

  return NextResponse.json({ ok: true, id: created._id.toString() });
}
