// app/api/health/route.ts
import { NextResponse } from "next/server";
import { logRequest } from "@/app/lib/logger";

export async function GET() {
  return logRequest(async () => {
    return NextResponse.json({ status: "ok" });
  });
}