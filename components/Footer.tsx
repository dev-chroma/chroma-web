"use client";

import Link from "next/link";

import { Mail, Globe, ArrowUpRight } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  const footerLinkClass =
    "group inline-flex items-center hover:text-white transition-colors";
  return (
    <footer className="bg-emerald-950 text-cream-50 pt-24 pb-12 rounded-t-4xl md:rounded-t-[4rem] mt-32 relative overflow-hidden">
      {/* TOP LINE */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-12">
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
                  Icon: FaWhatsapp,
                  url: "https://wa.me/918086636371",
                },
                {
                  Icon: FaInstagram,
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
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-sm">
              Resources
            </h4>

            <ul className="space-y-5 text-sm text-cream-50/60 font-medium">
              <li>
                <Link href="/submit" className={footerLinkClass}>
                  <span>Submission Guidelines</span>

                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/submit" className={footerLinkClass}>
                  <span>Editorial Policy</span>

                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/" className={footerLinkClass}>
                  <span>Author Interviews</span>

                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/about" className={footerLinkClass}>
                  <span>Writing Tips & Tricks</span>

                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* PLATFORM */}

          <div>
            <h4 className="text-white font-bold mb-10 uppercase tracking-[0.2em] text-sm">
              Platform
            </h4>

            <ul className="space-y-5 text-sm text-cream-50/60 font-medium">
              <li>
                <Link href="/about" className={footerLinkClass}>
                  <span>About Our Vision</span>
                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/contact" className={footerLinkClass}>
                  <span>Contact Editorial</span>
                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/auth" className={footerLinkClass}>
                  <span>Join the Team</span>

                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>

              <li>
                <Link href="/about" className={footerLinkClass}>
                  <span>Privacy & Safety</span>
                  <span className="w-4 ml-1 overflow-hidden">
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* PARTNER */}

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-2xl p-8 transition-all duration-500 hover:bg-white/8 hover:border-white/20">
            {/* Glow Effects */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/15" />

            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

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
            © {new Date().getFullYear()} CHROMADIARIES WEB MAGAZINE. ALL RIGHTS
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
