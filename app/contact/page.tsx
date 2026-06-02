"use client";

import Link from "next/link";

import { MapPin, Mail, MessageCircle, ArrowRight } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="bg-cream-50 min-h-screen px-8">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="mx-auto">
          {/* HEADER */}

          <div className="mb-12 md:mb-20">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-950/40 block">
              Official Channels
            </span>

            <h1 className="text-3xl md:text-6xl font-serif font-bold text-emerald-950 leading-tight">
              Connect
            </h1>
            <span className="font-serif italic font-normal text-emerald-800 text-xl md:text-4xl">
              with the Collective
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            {/* LEFT SIDE */}

            <div className="lg:col-span-5 flex flex-col">
              <div className="relative group p-8 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-950/8 shadow-3xl shadow-emerald-950/5 overflow-hidden flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-emerald-950/5 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24 group-hover:scale-110 transition-transform duration-700" />

                <div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-950 rounded-2xl flex items-center justify-center text-cream-50 mb-8 md:mb-10 shadow-xl shadow-emerald-950/20">
                    <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif font-bold text-emerald-950 mb-6 tracking-tight">
                    Our Editorial Office
                  </h3>

                  <div className="text-emerald-950/70 font-medium text-sm md:text-base leading-relaxed">
                    <p className="text-emerald-950 font-bold text-base md:text-lg">
                      ChromaDiaries English Web Magazine
                    </p>

                    <p>Sabeelul Hidaya Islamic College,</p>

                    <p>Vadheehidaya, Vattaparamba</p>

                    <p>Parappur (P.O), Kottakkal</p>

                    <p>Kerala, 676503</p>
                  </div>
                </div>

                <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-emerald-950/10">
                  <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Academic Partner Campus
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WHATSAPP */}

              <div className="md:col-span-2 p-8 md:p-12 bg-emerald-950 text-cream-50 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-emerald-950/20 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 group hover:bg-emerald-900 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/5 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4 md:space-y-6 max-w-64 text-center md:text-left">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto md:mx-0">
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif font-bold">
                    WhatsApp Support
                  </h3>

                  <p className="text-cream-50/50 text-[12px] md:text-[13px] font-medium leading-relaxed">
                    For rapid inquiries regarding submissions, editorial
                    feedback, or joining the collective. We&apos;re online and
                    ready to help.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                  <a
                    href="https://wa.me/918086636371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-6 px-6 py-4 bg-white/10 hover:bg-white text-cream-50 hover:text-emerald-950 rounded-2xl transition-all duration-300 group/link border border-white/10"
                  >
                    <span className="text-base md:text-lg font-bold font-serif">
                      +91 808663 6371
                    </span>

                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -rotate-45 group-hover/link:rotate-0 transition-transform" />
                  </a>

                  <a
                    href="https://wa.me/918075585732"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-6 px-6 py-4 bg-white/10 hover:bg-white text-cream-50 hover:text-emerald-950 rounded-2xl transition-all duration-300 group/link border border-white/10"
                  >
                    <span className="text-base md:text-lg font-bold font-serif">
                      +91 807558 5732
                    </span>

                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 -rotate-45 group-hover/link:rotate-0 transition-transform" />
                  </a>
                </div>
              </div>

              {/* OFFICIAL MAIL */}

              <div className="p-8 md:p-10 bg-white border border-emerald-950/8 rounded-4xl md:rounded-[3rem] shadow-2xl shadow-emerald-950/8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500 min-h-55 md:min-h-70">
                <div className="space-y-4 md:space-y-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-950/30 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40 mb-2">
                      Official Channel
                    </h4>

                    <h3 className="text-lg md:text-xl font-serif font-bold text-emerald-950">
                      Official Mail
                    </h3>
                  </div>
                </div>

                <a
                  href="mailto:chromadiariesofficial@gmail.com"
                  className="text-[11px] md:text-xs font-bold text-emerald-950 break-all hover:text-emerald-700 transition-colors flex items-center gap-2"
                >
                  chromadiariesofficial@gmail.com
                </a>
              </div>

              {/* EDITORIAL MAIL */}

              <div className="p-8 md:p-10 bg-white border border-emerald-950/8 rounded-4xl md:rounded-[3rem] shadow-2xl shadow-emerald-950/8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500 min-h-55 md:min-h-70">
                <div className="space-y-4 md:space-y-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-950/30 group-hover:bg-emerald-950 group-hover:text-cream-50 transition-colors">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40 mb-2">
                      Editorial Desk
                    </h4>

                    <h3 className="text-lg md:text-xl font-serif font-bold text-emerald-950">
                      Editors Email
                    </h3>
                  </div>
                </div>

                <a
                  href="mailto:chromadiarieseditors@gmail.com"
                  className="text-[11px] md:text-xs font-bold text-emerald-950 break-all hover:text-emerald-700 transition-colors flex items-center gap-2"
                >
                  chromadiarieseditors@gmail.com
                </a>
              </div>

              {/* CTA */}

              <div className="md:col-span-2 p-8 md:p-10 bg-emerald-100 rounded-[2.5rem] md:rounded-[3rem] border border-emerald-950/15 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
                <div className="space-y-2">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-950/40">
                    Join the collective
                  </p>

                  <h3 className="text-lg md:text-xl font-serif font-bold text-emerald-950">
                    Want to contribute your story?
                  </h3>
                </div>

                <Link
                  href="/auth"
                  className="w-full md:w-auto px-10 py-4 bg-emerald-950 text-cream-50 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-950/10 active:scale-95 whitespace-nowrap text-center"
                >
                  Join the Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
