// app/app/api/fmea/row/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { logRequest } from "@/app/lib/logger";

interface GenerateRequestBody {
  asset_class: string;
  failure_family: string;
}

interface FmeaLibraryRow {
  effect: string;
  causes: string[];
  detection: string[];
  actions: string[];
  sev_default: number;
  occ_default: number;
  det_default: number;
}

function computeRPN(sev: number, occ: number, det: number): number {
  return sev * occ * det;
}

export async function POST(req: NextRequest) {
  return logRequest(async () => {
    let body: GenerateRequestBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { asset_class, failure_family } = body;

    if (!asset_class || !failure_family) {
      return NextResponse.json(
        {
          error:
            "asset_class and failure_family are required",
        },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      const result = await client.query<FmeaLibraryRow>(
        `
        SELECT
          effect,
          causes,
          detection,
          actions,
          sev_default,
          occ_default,
          det_default
        FROM fmea_library
        WHERE asset_class = $1
          AND failure_family = $2
        LIMIT 1
        `,
        [asset_class, failure_family]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            error: "No matching library row found",
            asset_class,
            failure_family,
          },
          { status: 404 }
        );
      }

      const row = result.rows[0];

      const sev_pre = row.sev_default;
      const occ_pre = row.occ_default;
      const det_pre = row.det_default;
      const rpn_pre = computeRPN(sev_pre, occ_pre, det_pre);

      return NextResponse.json(
        {
          asset_class,
          failure_family,
          effect: row.effect,
          causes: row.causes,
          detection: row.detection,
          actions: row.actions,
          sev_pre,
          occ_pre,
          det_pre,
          rpn_pre,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error generating FMEA row from fmea_library:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  });
}
