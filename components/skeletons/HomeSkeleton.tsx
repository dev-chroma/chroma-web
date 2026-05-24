"use client";

import React from "react";

const HomeSkeleton = () => {
  return (
    <div className="font-sans select-none overflow-hidden">
      <style jsx global>{`
        @keyframes skeleton-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Light plate — base fill for most elements */
        .sk {
          position: relative;
          overflow: hidden;
          background-color: rgba(2, 44, 34, 0.06);
        }
        .sk::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.35) 40%,
            rgba(255, 255, 255, 0.55) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: skeleton-shimmer 2s infinite ease-in-out;
        }

        /* Dark plate — hero, CTA, heavier blocks */
        .sk-dark {
          position: relative;
          overflow: hidden;
          background-color: rgba(2, 44, 34, 0.1);
        }
        .sk-dark::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.06) 40%,
            rgba(255, 255, 255, 0.14) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: skeleton-shimmer 2s infinite ease-in-out;
        }

        /* Stagger shimmer per card */
        .sk-card:nth-child(1) .sk::after,
        .sk-card:nth-child(1) .sk-dark::after {
          animation-delay: 0ms;
        }
        .sk-card:nth-child(2) .sk::after,
        .sk-card:nth-child(2) .sk-dark::after {
          animation-delay: 130ms;
        }
        .sk-card:nth-child(3) .sk::after,
        .sk-card:nth-child(3) .sk-dark::after {
          animation-delay: 260ms;
        }
        .sk-card:nth-child(4) .sk::after,
        .sk-card:nth-child(4) .sk-dark::after {
          animation-delay: 390ms;
        }
      `}</style>

      <main className="container mx-auto px-4 py-12 md:py-8">
        {/* ── HERO ── */}
        <div className="mb-24 md:mb-32">
          <div className="h-[460px] md:h-[520px] rounded-[3.5rem] sk-dark" />
        </div>

        <div className="flex flex-col lg:flex-row gap-20 xl:gap-32">
          {/* ── ARTICLES ── */}
          <div className="lg:w-2/3">
            {/* Section heading */}
            <div className="mb-16 space-y-3">
              <div className="h-9 w-72 max-w-full rounded-2xl sk" />
              <div className="h-1.5 w-16 rounded-full bg-emerald-950/20" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="sk-card rounded-[2.5rem] overflow-hidden border border-emerald-950/[0.05] bg-white"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/11] sk">
                    <div className="absolute top-5 left-5 h-6 w-20 rounded-full bg-emerald-950/[0.06]" />
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-3 w-14 rounded-full sk" />
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-950/10" />
                      <div className="h-3 w-20 rounded-full sk" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2.5 mb-6">
                      <div className="h-5 w-full rounded-lg sk" />
                      <div className="h-5 w-4/5 rounded-lg sk" />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2 mb-8">
                      <div className="h-3.5 w-full rounded-full sk" />
                      <div className="h-3.5 w-full rounded-full sk" />
                      <div className="h-3.5 w-2/3 rounded-full sk" />
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-emerald-950/[0.05] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full sk" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 rounded-full sk" />
                          <div className="h-2.5 w-14 rounded-full sk" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-5 w-10 rounded-full sk" />
                        <div className="h-5 w-10 rounded-full sk" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load-more button */}
            <div className="mt-20 flex justify-center">
              <div className="h-13 w-56 rounded-full sk border border-emerald-950/[0.07]" />
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:w-1/3 space-y-10">
            {/* Trending block */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-emerald-950/[0.05]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-11 h-11 rounded-2xl sk" />
                <div className="h-4 w-32 rounded-full sk" />
              </div>
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-2xl sk shrink-0" />
                    <div className="flex-1 space-y-2 pt-0.5">
                      <div className="h-3.5 w-full rounded-full sk" />
                      <div className="h-3.5 w-4/5 rounded-full sk" />
                      <div className="h-3 w-14 rounded-full sk" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter / CTA block */}
            <div className="rounded-[3rem] p-10 sk-dark">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[1.5rem] sk mb-8" />
                <div className="h-6 w-48 rounded-xl sk mb-4" />
                <div className="space-y-2.5 w-full mb-10">
                  <div className="h-3 w-full rounded-full sk" />
                  <div className="h-3 w-4/5 mx-auto rounded-full sk" />
                </div>
                <div className="h-12 w-full rounded-full sk mb-4" />
                <div className="h-3 w-24 rounded-full sk" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeSkeleton;
