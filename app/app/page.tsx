import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full flex flex-col items-center gap-10">

        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={25}
          className="dark:invert opacity-70"
        />

        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Reliability Co-Engineer Playground
        </h1>

        {/* FIXED TYPO: classname → className */}
        <p className="text-slate-400 max-w-xl text-center leading-relaxed">
          This is your Stage-0 environment. You can test saving/fetching FMEA rows, 
          explore the API, and begin building the agentic reliability system step-by-step.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">

          {/* Stage 0 Dummy FMEA Page */}
          <Link
            href="/fmea-dummy"
            className="px-6 py-3 bg-sky-500 text-slate-950 text-lg rounded-xl hover:bg-sky-400 transition-colors font-medium shadow-lg shadow-sky-500/20 text-center"
          >
            Dummy FMEA UI →
          </Link>

          {/* Stage 1 FMEA Generator */}
          <Link
            href="/fmea-generator"
            className="px-6 py-3 bg-emerald-500 text-slate-950 text-lg rounded-xl hover:bg-emerald-400 transition-colors font-medium shadow-lg shadow-emerald-500/20 text-center"
          >
            FMEA Generator (Stage 1) →
          </Link>

          {/* Docs Link */}
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-900 transition-colors text-center"
          >
            Next.js Docs
          </a>

        </div>

      </div>
    </main>
  );
}
