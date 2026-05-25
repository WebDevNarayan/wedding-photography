import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? `SET (length: ${process.env.NEON_DATABASE_URL.length})` : "NOT SET / EMPTY",
    NEON_DIRECT_URL: process.env.NEON_DIRECT_URL ? `SET (length: ${process.env.NEON_DIRECT_URL.length})` : "NOT SET / EMPTY",
    DATABASE_URL: process.env.DATABASE_URL ? `SET (length: ${process.env.DATABASE_URL.length})` : "NOT SET / EMPTY",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}
