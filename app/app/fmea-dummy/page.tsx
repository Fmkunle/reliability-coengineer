"use client";

import { useEffect, useState } from "react";

interface DummyRow {
  id: number;
  component: string | null;
  failure_mode: string | null;
  effects: string | null;
  sev_pre: number | null;
  cause: string | null;
  occ_pre: number | null;
  current_design: string | null;
  det_pre: number | null;
  justification_pre: string | null;
  rpn_pre: number | null;
  recommended_actions: string | null;
  justification_post: string | null;
  responsible: string | null;
  action_status: string | null;
  sev_post: number | null;
  occ_post: number | null;
  det_post: number | null;
  rpn_post: number | null;
  created_at: string;
}

export default function FmeaDummyPage() {
  const [rows, setRows] = useState<DummyRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<DummyRow | null>(null);

  const [component, setComponent] = useState("");
  const [failureMode, setFailureMode] = useState("");
  const [effects, setEffects] = useState("");
  const [sevPre, setSevPre] = useState("");
  const [cause, setCause] = useState("");
  const [occPre, setOccPre] = useState("");
  const [currentDesign, setCurrentDesign] = useState("");
  const [detPre, setDetPre] = useState("");
  const [justificationPre, setJustificationPre] = useState("");
  const [recommendedActions, setRecommendedActions] = useState("");
  const [justificationPost, setJustificationPost] = useState("");
  const [responsible, setResponsible] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [sevPost, setSevPost] = useState("");
  const [occPost, setOccPost] = useState("");
  const [detPost, setDetPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadRows() {
    const res = await fetch("/api/fmea/dummy");
    const data = await res.json();
    setRows(data);
  }

  useEffect(() => {
    loadRows();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSaved(false);

    if (!component || !failureMode || !effects) {
      setError("Please fill in at least Component, Failure mode, and Effects.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/fmea/dummy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component,
          failure_mode: failureMode,
          effects,
          cause,
          current_design: currentDesign,
          justification_pre: justificationPre,
          recommended_actions: recommendedActions,
          justification_post: justificationPost,
          responsible,
          action_status: actionStatus,
          sev_pre: sevPre,
          occ_pre: occPre,
          det_pre: detPre,
          sev_post: sevPost,
          occ_post: occPost,
          det_post: detPost,
        }),
      });
      if (!res.ok) {
        setError("Failed to create row. Check console for details.");
        console.error("Failed to create row", await res.text());
        return;
      }
      await loadRows();

      setComponent("");
      setFailureMode("");
      setEffects("");
      setSevPre("");
      setCause("");
      setOccPre("");
      setCurrentDesign("");
      setDetPre("");
      setJustificationPre("");
      setRecommendedActions("");
      setJustificationPost("");
      setResponsible("");
      setActionStatus("");
      setSevPost("");
      setOccPost("");
      setDetPost("");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Dummy FMEA Rows <span className="text-sky-400 text-base">Stage 0</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Minimal playground to prove we can save and fetch rows from Postgres.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <div>API: <code className="text-sky-300">/api/fmea/dummy</code></div>
            <div>DB: <code className="text-sky-300">fmea_dummy</code></div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form card */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-300">
                1
              </span>
              Create dummy row
            </h2>

            {error && (
              <div className="mb-3 rounded-md border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            )}

            {justSaved && !error && (
              <div className="mb-3 rounded-md border border-emerald-500/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
                Row saved ✅
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic scenario */}
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Component
                  </label>
                  <input
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    placeholder="e.g. Pump seal, Conveyor belt"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Failure mode
                  </label>
                  <input
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={failureMode}
                    onChange={(e) => setFailureMode(e.target.value)}
                    placeholder="e.g. Seal failure, Belt misalignment"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Effects
                </label>
                <textarea
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[72px]"
                  value={effects}
                  onChange={(e) => setEffects(e.target.value)}
                  placeholder="What happens when this failure occurs?"
                />
              </div>

              {/* Pre-control block */}
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    SEV (pre)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={sevPre}
                    onChange={(e) => setSevPre(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    OCC (pre)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={occPre}
                    onChange={(e) => setOccPre(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    DET (pre)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={detPre}
                    onChange={(e) => setDetPre(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Cause
                </label>
                <input
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  placeholder="Root causes of the failure mode"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Current design / controls
                </label>
                <textarea
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[72px]"
                  value={currentDesign}
                  onChange={(e) => setCurrentDesign(e.target.value)}
                  placeholder="What design or process controls currently exist?"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Justification (pre)
                </label>
                <textarea
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[72px]"
                  value={justificationPre}
                  onChange={(e) => setJustificationPre(e.target.value)}
                  placeholder="Why did you choose the pre-control ratings?"
                />
              </div>

              {/* Recommended actions & post-control */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Recommended actions
                </label>
                <textarea
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[72px]"
                  value={recommendedActions}
                  onChange={(e) => setRecommendedActions(e.target.value)}
                  placeholder="What actions should be taken?"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    SEV (post)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={sevPost}
                    onChange={(e) => setSevPost(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    OCC (post)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={occPost}
                    onChange={(e) => setOccPost(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    DET (post)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={detPost}
                    onChange={(e) => setDetPost(e.target.value)}
                    placeholder="1–10"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-300">
                    Justification (post)
                  </label>
                  <textarea
                    className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[72px]"
                    value={justificationPost}
                    onChange={(e) => setJustificationPost(e.target.value)}
                    placeholder="Why did you choose the post-control ratings?"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Responsible
                    </label>
                    <input
                      className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={responsible}
                      onChange={(e) => setResponsible(e.target.value)}
                      placeholder="Owner of the action"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-300">
                      Action status
                    </label>
                    <input
                      className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value)}
                      placeholder="Open, In progress, Closed..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-sm font-medium hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500 transition-colors"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save dummy row"}
              </button>
            </form>
          </section>

          {/* Table card */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40 overflow-hidden">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-300">
                2
              </span>
              Recent rows
            </h2>

            {rows.length === 0 ? (
              <p className="text-sm text-slate-400">
                No rows yet. Create one in the form on the left.
              </p>
            ) : (
              <div className="rounded-xl border border-slate-800 overflow-auto bg-slate-950/40">
                <table className="min-w-full text-[11px] sm:text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        ID
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Component
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Failure mode
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Effects
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        SEV
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        OCC
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        DET
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        RPN
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300 hidden lg:table-cell">
                        Responsible / Status
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300 hidden md:table-cell">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-slate-800/80 hover:bg-slate-900/60 transition-colors cursor-pointer"
                        onClick={() => setSelectedRow(r)}
                      >
                        <td className="p-2 align-top text-slate-200">{r.id}</td>
                        <td className="p-2 align-top text-slate-200">
                          {r.component}
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.failure_mode}
                        </td>
                        <td className="p-2 align-top text-slate-300 max-w-xs">
                          <div className="line-clamp-3">{r.effects}</div>
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.sev_pre ?? "-"}
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.occ_pre ?? "-"}
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.det_pre ?? "-"}
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.rpn_pre ?? "-"}
                        </td>
                        <td className="p-2 align-top text-slate-200 hidden lg:table-cell">
                          <div className="text-slate-200">
                            {r.responsible || "-"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {r.action_status || ""}
                          </div>
                        </td>
                        <td className="p-2 align-top text-slate-400 text-[10px] hidden md:table-cell">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Details drawer / modal */}
        {selectedRow && (
          <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 px-4 py-6">
            <div className="max-w-3xl w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/70 overflow-hidden">
              <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    FMEA row details
                  </div>
                  <div className="text-sm font-semibold text-slate-100">
                    #{selectedRow.id} &mdash; {selectedRow.component} / {selectedRow.failure_mode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  Close
                </button>
              </header>

              <div className="max-h-[70vh] overflow-y-auto px-4 py-4 space-y-4 text-sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Component
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.component || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Failure mode
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.failure_mode || "—"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Effects
                  </div>
                  <div className="text-slate-100 whitespace-pre-line">
                    {selectedRow.effects || "—"}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      SEV (pre)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.sev_pre ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      OCC (pre)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.occ_pre ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      DET (pre)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.det_pre ?? "—"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Cause
                  </div>
                  <div className="text-slate-100 whitespace-pre-line">
                    {selectedRow.cause || "—"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Current design / controls
                  </div>
                  <div className="text-slate-100 whitespace-pre-line">
                    {selectedRow.current_design || "—"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Justification (pre)
                  </div>
                  <div className="text-slate-100 whitespace-pre-line">
                    {selectedRow.justification_pre || "—"}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      RPN (pre)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.rpn_pre ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      SEV (post)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.sev_post ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      OCC (post)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.occ_post ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      DET (post)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.det_post ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      RPN (post)
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.rpn_post ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Recommended actions
                    </div>
                    <div className="text-slate-100 whitespace-pre-line">
                      {selectedRow.recommended_actions || "—"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Justification (post)
                    </div>
                    <div className="text-slate-100 whitespace-pre-line">
                      {selectedRow.justification_post || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Responsible / status
                    </div>
                    <div className="text-slate-100">
                      {selectedRow.responsible || "—"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedRow.action_status || ""}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Created
                  </div>
                  <div className="text-slate-100">
                    {new Date(selectedRow.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
