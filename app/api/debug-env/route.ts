import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? `SET (length: ${process.env.DATABASE_URL.length})` : "NOT SET / EMPTY",
    DIRECT_URL: process.env.DIRECT_URL ? `SET (length: ${process.env.DIRECT_URL.length})` : "NOT SET / EMPTY",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}
