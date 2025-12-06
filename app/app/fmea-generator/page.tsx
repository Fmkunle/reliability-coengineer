"use client";

import { useState } from "react";

type GeneratedRow = {
  asset_class: string;
  failure_family: string;
  effect: string;
  causes: string[];
  detection: string[];
  actions: string[];
  sev_pre: number;
  occ_pre: number;
  det_pre: number;
  rpn_pre: number;
};

export default function FmeaGeneratorPage() {
  const [assetClass, setAssetClass] = useState("");
  const [failureFamily, setFailureFamily] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedRow | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!assetClass || !failureFamily) {
      setError("Please select both asset class and failure family.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/fmea/row/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_class: assetClass,
          failure_family: failureFamily,
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
              Library-only generator: look up a template row in{" "}
              <code className="text-sky-300">fmea_library</code>, compute RPN
              deterministically, and display the result.
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
                fmea_library
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
                  Asset class
                </label>
                <select
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={assetClass}
                  onChange={(e) => {
                    setAssetClass(e.target.value);
                    setFailureFamily("");
                  }}
                >
                  <option value="">Select asset class...</option>
                  <option value="Pump">Pump</option>
                  <option value="Conveyor">Conveyor</option>
                  {/* Extend with more asset classes as you add to fmea_library */}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Failure family
                </label>
                <select
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={failureFamily}
                  onChange={(e) => setFailureFamily(e.target.value)}
                  disabled={!assetClass}
                >
                  <option value="">
                    {assetClass
                      ? "Select failure family..."
                      : "Select an asset class first"}
                  </option>

                  {/* Very simple hard-coded mapping for Stage 1 */}
                  {assetClass === "Pump" && (
                    <option value="Seal failure">Seal failure</option>
                  )}
                  {assetClass === "Conveyor" && (
                    <option value="Belt misalignment">
                      Belt misalignment
                    </option>
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
                template row from <code className="text-sky-300">fmea_library</code>{" "}
                and compute <code className="text-sky-300">rpn_pre = sev_pre × occ_pre × det_pre</code>.
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
                        {result.asset_class} &mdash; {result.failure_family}
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
                        S: {result.sev_pre} &nbsp; O: {result.occ_pre} &nbsp; D:{" "}
                        {result.det_pre}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Effect
                    </h3>
                    <p className="text-sm text-slate-200">
                      {result.effect}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Causes
                    </h3>
                    {result.causes && result.causes.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
                        {result.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No causes in library.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Detection
                    </h3>
                    {result.detection && result.detection.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
                        {result.detection.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No detection methods in library.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="text-xs font-semibold text-slate-300 mb-1">
                      Recommended actions
                    </h3>
                    {result.actions && result.actions.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
                        {result.actions.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No actions in library.</p>
                    )}
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
