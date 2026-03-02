// app/app/api/fmea/row/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { logRequest } from "@/app/lib/logger";

interface GenerateRequestBody {
  component: string;
  failure_mode: string;
}

interface FmeaDummyRow {
  component: string | null;
  failure_mode: string | null;
  effects: string | null;
  cause: string | null;
  current_design: string | null;
  recommended_actions: string | null;
  sev_pre: number | null;
  occ_pre: number | null;
  det_pre: number | null;
  rpn_pre: number | null;
  sev_post: number | null;
  occ_post: number | null;
  det_post: number | null;
  rpn_post: number | null;
}

function computeRPN(sev: number | null, occ: number | null, det: number | null): number | null {
  if (sev == null || occ == null || det == null) return null;
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

    const { component, failure_mode } = body;

    if (!component || !failure_mode) {
      return NextResponse.json(
        {
          error: "component and failure_mode are required",
        },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      const result = await client.query<FmeaDummyRow>(
        `
        SELECT
          component,
          failure_mode,
          effects,
          cause,
          current_design,
          recommended_actions,
          sev_pre,
          occ_pre,
          det_pre,
          rpn_pre,
          sev_post,
          occ_post,
          det_post,
          rpn_post
        FROM fmea_dummy
        WHERE component = $1
          AND failure_mode = $2
        LIMIT 1
        `,
        [component, failure_mode]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            error: "No matching FMEA row found in fmea_dummy",
            component,
            failure_mode,
          },
          { status: 404 }
        );
      }

      const row = result.rows[0];

      const sev_pre = row.sev_pre;
      const occ_pre = row.occ_pre;
      const det_pre = row.det_pre;
      const computedRpnPre = computeRPN(sev_pre, occ_pre, det_pre);

      const sev_post = row.sev_post;
      const occ_post = row.occ_post;
      const det_post = row.det_post;
      const computedRpnPost = computeRPN(sev_post, occ_post, det_post);

      const rpn_pre = row.rpn_pre ?? computedRpnPre;
      const rpn_post = row.rpn_post ?? computedRpnPost;

      return NextResponse.json(
        {
          component: row.component,
          failure_mode: row.failure_mode,
          effects: row.effects,
          cause: row.cause,
          current_design: row.current_design,
          recommended_actions: row.recommended_actions,
          sev_pre,
          occ_pre,
          det_pre,
          rpn_pre,
          sev_post,
          occ_post,
          det_post,
          rpn_post,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error generating FMEA row from fmea_dummy:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  });
}
