"use client";

import Link from "next/link";

import { Mail, Globe, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-cream-50 pt-24 pb-12 rounded-t-4xl md:rounded-t-[4rem] mt-32 relative overflow-hidden">
      {/* TOP LINE */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* BRAND */}

          <div className="space-y-8">
            <div className="relative h-12 md:h-16 w-40">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-white.png"
                  alt="Chroma Diaries"
                  className="object-contain"
                  fill
                />
              </Link>
            </div>

            <p className="text-cream-50/50 text-sm leading-relaxed max-w-xs font-medium">
              A creative sanctuary for writers under 18. Fostering the next
              generation of literary talent through expression and community.
            </p>

            {/* SOCIALS */}

            <div className="flex gap-4 pt-2">
              {[
                {
                  Icon: Globe,
                  url: "https://chromadiaries.com",
                },
                {
                  Icon: MessageSquare,
                  url: "https://discord.gg/chromadiaries",
                },
                {
                  Icon: Share2,
                  url: "https://instagram.com/chromadiaries",
                },
                {
                  Icon: Mail,
                  url: "mailto:editorial@chromadiaries.com",
                },
              ].map(({ Icon, url }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-emerald-950 transition-all duration-300 border border-white/10 hover:border-white"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* RESOURCES */}

          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">
              Resources
            </h4>

            <ul className="space-y-5 text-sm text-cream-50/60 font-medium">
              <li>
                <Link
                  href="/submit"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Submission Guidelines
                </Link>
              </li>

              <li>
                <Link
                  href="/submit"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Editorial Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Author Interviews
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Writing Tips & Tricks
                </Link>
              </li>
            </ul>
          </div>

          {/* PLATFORM */}

          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">
              Platform
            </h4>

            <ul className="space-y-5 text-sm text-cream-50/60 font-medium">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  About Our Vision
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Contact Editorial
                </Link>
              </li>

              <li>
                <Link
                  href="/auth"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Join the Team
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-all hover:translate-x-1 inline-block"
                >
                  Privacy & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* PARTNER */}

          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative group overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />

            <h4 className="text-white font-serif font-bold mb-6 text-xl">
              Academic partner
            </h4>

            <div className="space-y-4">
              <p className="text-sm text-cream-50/60 leading-relaxed font-medium">
                Proudly supported and mentored by the esteemed faculty of
              </p>

              <div className="border-l-2 border-white/20 pl-4 py-1">
                <span className="text-white font-bold block text-lg leading-tight font-serif italic">
                  Sabeelul Hidaya
                  <br />
                  Islamic College
                </span>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">SH</span>
                </div>

                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Official Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-cream-50/30">
          <div>
            © {new Date().getFullYear()} CHROMA DIARIES MAGAZINE. ALL RIGHTS
            RESERVED.
          </div>

          <div className="flex gap-12">
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>

            <Link href="/about" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
