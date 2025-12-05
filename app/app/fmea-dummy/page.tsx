"use client";

import { useEffect, useState } from "react";

interface DummyRow {
  id: number;
  asset_class: string;
  failure_family: string;
  effect: string;
  created_at: string;
}

export default function FmeaDummyPage() {
  const [rows, setRows] = useState<DummyRow[]>([]);
  const [assetClass, setAssetClass] = useState("");
  const [failureFamily, setFailureFamily] = useState("");
  const [effect, setEffect] = useState("");
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

    if (!assetClass || !failureFamily || !effect) {
      setError("Please fill in all fields before saving.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/fmea/dummy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_class: assetClass,
          failure_family: failureFamily,
          effect: effect,
        }),
      });
      if (!res.ok) {
        setError("Failed to create row. Check console for details.");
        console.error("Failed to create row", await res.text());
        return;
      }
      await loadRows();
      setAssetClass("");
      setFailureFamily("");
      setEffect("");
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
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Asset class
                </label>
                <input
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={assetClass}
                  onChange={(e) => setAssetClass(e.target.value)}
                  placeholder="Pump, Conveyor, Motor..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Failure family
                </label>
                <input
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={failureFamily}
                  onChange={(e) => setFailureFamily(e.target.value)}
                  placeholder="Seal failure, Bearing failure..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Effect
                </label>
                <textarea
                  className="border border-slate-700 bg-slate-950/60 rounded-lg px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[80px]"
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  placeholder="What happens when this failure occurs?"
                />
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
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      <th className="p-2 text-left font-semibold text-slate-300">ID</th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Asset
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Failure family
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-300">
                        Effect
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
                        className="border-b border-slate-800/80 hover:bg-slate-900/60 transition-colors"
                      >
                        <td className="p-2 align-top text-slate-200">{r.id}</td>
                        <td className="p-2 align-top text-slate-200">
                          {r.asset_class}
                        </td>
                        <td className="p-2 align-top text-slate-200">
                          {r.failure_family}
                        </td>
                        <td className="p-2 align-top text-slate-300 max-w-xs">
                          <div className="line-clamp-3">{r.effect}</div>
                        </td>
                        <td className="p-2 align-top text-slate-400 text-[11px] hidden md:table-cell">
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
      </div>
    </main>
  );
}
