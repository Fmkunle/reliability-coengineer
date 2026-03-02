// app/app/api/fmea/dummy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { logRequest } from "@/app/lib/logger";

function toIntOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function GET() {
  return logRequest(async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT
           id,
           component,
           failure_mode,
           effects,
           sev_pre,
           cause,
           occ_pre,
           current_design,
           det_pre,
           justification_pre,
           rpn_pre,
           recommended_actions,
           justification_post,
           responsible,
           action_status,
           sev_post,
           occ_post,
           det_post,
           rpn_post,
           created_at
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

    const {
      component,
      failure_mode,
      effects,
      cause,
      current_design,
      justification_pre,
      recommended_actions,
      justification_post,
      responsible,
      action_status,
      sev_pre,
      occ_pre,
      det_pre,
      sev_post,
      occ_post,
      det_post,
    } = body ?? {};

    if (!component || !failure_mode || !effects) {
      return NextResponse.json(
        {
          error:
            "component, failure_mode, and effects are required",
        },
        { status: 400 }
      );
    }

    const sevPre = toIntOrNull(sev_pre);
    const occPre = toIntOrNull(occ_pre);
    const detPre = toIntOrNull(det_pre);
    const sevPost = toIntOrNull(sev_post);
    const occPost = toIntOrNull(occ_post);
    const detPost = toIntOrNull(det_post);

    const rpnPre =
      sevPre !== null && occPre !== null && detPre !== null
        ? sevPre * occPre * detPre
        : null;
    const rpnPost =
      sevPost !== null && occPost !== null && detPost !== null
        ? sevPost * occPost * detPost
        : null;

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO fmea_dummy (
           component,
           failure_mode,
           effects,
           sev_pre,
           cause,
           occ_pre,
           current_design,
           det_pre,
           justification_pre,
           rpn_pre,
           recommended_actions,
           justification_post,
           responsible,
           action_status,
           sev_post,
           occ_post,
           det_post,
           rpn_post
         )
         VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9,
           $10, $11, $12, $13, $14, $15, $16, $17, $18
         )
         RETURNING
           id,
           component,
           failure_mode,
           effects,
           sev_pre,
           cause,
           occ_pre,
           current_design,
           det_pre,
           justification_pre,
           rpn_pre,
           recommended_actions,
           justification_post,
           responsible,
           action_status,
           sev_post,
           occ_post,
           det_post,
           rpn_post,
           created_at`,
        [
          component,
          failure_mode,
          effects,
          sevPre,
          cause ?? null,
          occPre,
          current_design ?? null,
          detPre,
          justification_pre ?? null,
          rpnPre,
          recommended_actions ?? null,
          justification_post ?? null,
          responsible ?? null,
          action_status ?? null,
          sevPost,
          occPost,
          detPost,
          rpnPost,
        ]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  });
}
