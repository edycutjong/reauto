import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "reauto-forensics",
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
}
