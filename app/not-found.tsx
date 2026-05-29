import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* DECORATION

        <div className="mb-10 flex justify-center">
          <div className="w-24 h-24 rounded-full border border-emerald-950/10 flex items-center justify-center">
            <Feather className="w-10 h-10 text-emerald-950/40" />
          </div>
        </div> */}

        {/* ERROR */}

        <div className="mb-8">
          <p className="text-[10rem] md:text-[12rem] leading-none font-serif font-bold text-emerald-950/10">
            404
          </p>
        </div>

        {/* TITLE */}

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-emerald-950 mb-6">
          Lost in the Archives
        </h1>

        {/* DESCRIPTION */}

        <p className="max-w-xl mx-auto text-lg text-emerald-950/60 leading-relaxed mb-12">
          The page you seek appears to have vanished between unfinished drafts,
          forgotten journals, and unwritten stories. Perhaps it was never
          published—or perhaps it simply awaits discovery.
        </p>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-950 text-white rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:bg-emerald-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Return Home
          </Link>

          <Link
            href="/"
            className="px-8 py-4 border border-emerald-950/10 rounded-full text-emerald-950 font-bold text-xs tracking-[0.2em] uppercase hover:bg-emerald-950/5 transition-all"
          >
            Explore Articles
          </Link>
        </div>

        {/* FOOTNOTE */}

        <div className="mt-20">
          <div className="w-24 h-px bg-emerald-950/10 mx-auto mb-6" />

          <p className="text-xs uppercase tracking-[0.3em] text-emerald-950/30">
            Chroma Diaries Archive
          </p>
        </div>
      </div>
    </div>
  );
}
