// app/app/api/fmea/dummy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { logRequest } from "@/app/lib/logger";

export async function GET() {
  return logRequest(async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, asset_class, failure_family, effect, created_at
         FROM fmea_dummy
         ORDER BY created_at DESC
         LIMIT 20`
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  });
}

export async function POST(req: NextRequest) {
  return logRequest(async () => {
    const body = await req.json();
    const { asset_class, failure_family, effect } = body;

    if (!asset_class || !failure_family || !effect) {
      return NextResponse.json(
        { error: "asset_class, failure_family, and effect are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO fmea_dummy (asset_class, failure_family, effect)
         VALUES ($1, $2, $3)
         RETURNING id, asset_class, failure_family, effect, created_at`,
        [asset_class, failure_family, effect]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  });
}
