"use client";

import { useState } from "react";

type GeneratedRow = {
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
};

export default function FmeaGeneratorPage() {
  const [component, setComponent] = useState("");
  const [failureMode, setFailureMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedRow | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!component || !failureMode) {
      setError("Please select both component and failure mode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/fmea/row/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component,
          failure_mode: failureMode,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Generate error:", text);
        try {
          const parsed = JSON.parse(text);
          setError(
            parsed?.error ||
              `Failed to generate row (status ${res.status}).`
          );
        } catch {
          setError(`Failed to generate row (status ${res.status}).`);
        }
        return;
      }

      const data = (await res.json()) as GeneratedRow;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unexpected error while generating row. Check console for details.");
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
              FMEA Generator{" "}
              <span className="text-sky-400 text-base">Stage 1</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Library-only generator using rows from{" "}
              <code className="text-sky-300">fmea_dummy</code>: look up a stored
              scenario by component and failure mode, compute RPN deterministically,
              and display the result.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <div>
              API:{" "}
              <code className="text-sky-300">
                /api/fmea/row/generate
              </code>
            </div>
            <div>
              DB:{" "}
              <code className="text-sky-300">
                fmea_dummy
              </code>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left side: controls */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-300">
                1
              </span>
              Choose failure scenario
            </h2>

            {error && (
              <div className="mb-3 rounded-md border border-rose-500/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Component
                </label>
                <select
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={component}
                  onChange={(e) => {
                    setComponent(e.target.value);
                    setFailureMode("");
                  }}
                >
                  <option value="">Select component...</option>
                  <option value="Pump seal">Pump seal</option>
                  <option value="Conveyor belt">Conveyor belt</option>
                  <option value="Drive motor">Drive motor</option>
                  <option value="Cooling fan">Cooling fan</option>
                  <option value="Isolation valve">Isolation valve</option>
                  <option value="Gearbox">Gearbox</option>
                  <option value="Air compressor">Air compressor</option>
                  <option value="Heat exchanger">Heat exchanger</option>
                  <option value="Pump bearing">Pump bearing</option>
                  <option value="Process filter">Process filter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Failure mode
                </label>
                <select
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={failureMode}
                  onChange={(e) => setFailureMode(e.target.value)}
                  disabled={!component}
                >
                  <option value="">
                    {component
                      ? "Select failure mode..."
                      : "Select a component first"}
                  </option>

                  {component === "Pump seal" && (
                    <option value="Seal failure">Seal failure</option>
                  )}
                  {component === "Conveyor belt" && (
                    <option value="Belt misalignment">Belt misalignment</option>
                  )}
                  {component === "Drive motor" && (
                    <option value="Overheating">Overheating</option>
                  )}
                  {component === "Cooling fan" && (
                    <option value="Blade imbalance">Blade imbalance</option>
                  )}
                  {component === "Isolation valve" && (
                    <option value="Stuck open">Stuck open</option>
                  )}
                  {component === "Gearbox" && (
                    <option value="Lubrication loss">Lubrication loss</option>
                  )}
                  {component === "Air compressor" && (
                    <option value="High vibration">High vibration</option>
                  )}
                  {component === "Heat exchanger" && (
                    <option value="Fouling">Fouling</option>
                  )}
                  {component === "Pump bearing" && (
                    <option value="Spalling">Spalling</option>
                  )}
                  {component === "Process filter" && (
                    <option value="Plugging">Plugging</option>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-sm font-medium hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500 transition-colors"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate row"}
              </button>

              <p className="text-[11px] text-slate-500">
                Stage 1 constraint: library-only, no AI. We simply look up a
                stored row in <code className="text-sky-300">fmea_dummy</code>{" "}
                and compute{" "}
                <code className="text-sky-300">
                  rpn_pre = sev_pre × occ_pre × det_pre
                </code>{" "}
                if needed.
              </p>
            </form>
          </section>

          {/* Right side: result */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-xs text-sky-300">
                2
              </span>
              Generated FMEA row
            </h2>

            {!result ? (
              <p className="text-sm text-slate-400">
                Choose an asset class and failure family on the left, then click{" "}
                <span className="text-sky-300 font-medium">
                  Generate row
                </span>{" "}
                to populate this panel.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Summary header */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Scenario
                      </div>
                      <div className="text-sm font-semibold text-slate-100">
                        {result.component} &mdash; {result.failure_mode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        RPN (pre-control)
                      </div>
                      <div className="text-xl font-semibold text-sky-300">
                        {result.rpn_pre}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        S: {result.sev_pre ?? "-"} &nbsp; O:{" "}
                        {result.occ_pre ?? "-"} &nbsp; D:{" "}
                        {result.det_pre ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Effects
                    </h3>
                    <p className="text-sm text-slate-200">
                      {result.effects}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Cause
                    </h3>
                    <p className="text-sm text-slate-200">
                      {result.cause || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Current design / controls
                    </h3>
                    <p className="text-sm text-slate-200">
                      {result.current_design || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Recommended actions
                    </h3>
                    <p className="text-sm text-slate-200">
                      {result.recommended_actions || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
