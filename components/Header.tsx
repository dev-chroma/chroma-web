"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Image from "next/image";

import { usePathname } from "next/navigation";

import { Search, User, Menu, ChevronDown, X, LogOut } from "lucide-react";

import { api } from "@/services/api";

import { useAuth } from "@/contexts/AuthContext";

import type { PublicArticle } from "@/types/article";

const Header = () => {
  const { user, loading, logout } = useAuth();

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PublicArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setIsSearching(true);

          const data = await api.articles.search(searchQuery);

          setSearchResults(data.articles || []);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navItems = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "About",

      path: "/about",

      dropdown: [
        {
          name: "Our Story",
          path: "/about",
        },

        {
          name: "Submission Guidelines",
          path: "/submit",
        },
      ],
    },

    {
      name: "Categories",

      path: "/",

      dropdown: [
        {
          name: "Feature Articles",
          path: "/?category=Feature",
        },

        {
          name: "Essays",
          path: "/?category=Essays",
        },

        {
          name: "Stories",
          path: "/?category=Story",
        },

        {
          name: "Poems",
          path: "/?category=Poetry",
        },

        {
          name: "Translations",
          path: "/?category=Translations",
        },

        {
          name: "Reviews",
          path: "/?category=Reviews",
        },

        {
          name: "Travelogues",
          path: "/?category=Travelogues",
        },
      ],
    },

    {
      name: "Letters",
      path: "/?category=Letters",
    },

    {
      name: "Essays",
      path: "/?category=Essays",
    },

    {
      name: "Contact",
      path: "/contact",
    },
  ];

  if (loading) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-8 bg-cream-50/80 backdrop-blur-md border-b border-emerald-950/10">
        {/* TOP BAR */}

        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          {/* LEFT */}

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-emerald-950/5 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-emerald-950" />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Chroma Diaries"
                width={140}
                height={60}
                className="h-12 md:h-16 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group py-4">
                <Link
                  href={item.path}
                  className={`flex items-center gap-1 text-sm font-bold transition-colors uppercase tracking-widest ${
                    pathname === item.path
                      ? "text-emerald-950"
                      : "text-emerald-950/60 hover:text-emerald-950"
                  }`}
                >
                  {item.name}

                  {item.dropdown && (
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {item.dropdown && (
                  <div className="absolute top-full left-0 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                    <div className="bg-white border border-emerald-950/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className="block px-4 py-2.5 text-xs font-bold text-emerald-950/60 hover:text-emerald-950 hover:bg-emerald-950/5 rounded-xl transition-all uppercase tracking-wider"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT */}

          <div className="flex items-center gap-3 shrink-0">
            {/* SEARCH */}

            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex p-2.5 hover:bg-emerald-950/5 rounded-full transition-colors relative"
            >
              <Search className="w-5 h-5 text-emerald-950" />
            </button>

            {/* AUTH */}

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-950 text-cream-50 rounded-full text-sm font-bold hover:bg-emerald-900 hover:text-white transition-all hover:shadow-lg hover:shadow-emerald-950/20"
                >
                  <User className="w-4 h-4" />

                  <span className="hidden sm:inline">My Studio</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 hover:bg-red-50 text-emerald-950/40 hover:text-red-500 rounded-full transition-all group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-950 text-cream-50 rounded-full text-sm font-bold hover:bg-emerald-900 hover:text-white transition-all shadow-md"
              >
                <User className="w-4 h-4" />

                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-cream-50 border-b border-emerald-950/10 p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-3">
                <Link
                  href={item.path}
                  className="block text-lg font-serif font-bold text-emerald-950"
                  onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <div className="pl-4 space-y-3 border-l border-emerald-950/10">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className="block text-sm font-medium text-emerald-950/60 hover:text-emerald-950"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-emerald-950/10 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-950/40" />

                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => {
                    setIsSearchOpen(true);

                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-emerald-950/5 border border-emerald-950/10 rounded-full py-2.5 pl-12 focus:bg-white text-sm transition-all outline-none"
                />
              </div>

              {user && (
                <button
                  onClick={() => {
                    logout();

                    setIsMobileMenuOpen(false);
                  }}
                  className="p-3 bg-red-50 text-red-500 rounded-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SEARCH OVERLAY */}

      {isSearchOpen && (
        <div className="fixed inset-0 z-9999 flex flex-col overflow-hidden bg-white">
          <div className="container mx-auto px-4 h-full flex flex-col">
            {/* HEADER */}

            <div className="flex justify-between items-center py-8">
              <Link
                href="/"
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="Chroma Diaries"
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </Link>

              <button
                onClick={() => {
                  setIsSearchOpen(false);

                  setSearchQuery("");
                }}
                className="group p-4 bg-emerald-950/5 hover:bg-emerald-950 rounded-full transition-all duration-300"
              >
                <X className="w-6 h-6 text-emerald-950 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="max-w-4xl mx-auto w-full pt-16 flex-1 flex flex-col min-h-0">
              {/* INPUT */}

              <div className="relative group mb-12">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 text-emerald-950/20 group-focus-within:text-emerald-950 transition-colors" />

                <input
                  autoFocus
                  type="text"
                  placeholder="Ask anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-emerald-950/10 focus:border-emerald-950 py-8 pl-18 text-3xl md:text-6xl font-serif outline-none transition-all placeholder:text-emerald-950/10"
                />
              </div>

              {/* RESULTS */}

              <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                {searchQuery.trim() === "" ? (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-950/40">
                        Suggested for you
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {[
                          "Literary Essays",
                          "Historical Fiction",
                          "Poetry",
                          "Travelogues",
                          "Book Reviews",
                        ].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-8 py-4 border border-emerald-950/10 hover:border-emerald-950 hover:bg-emerald-950 hover:text-cream-50 rounded-full text-sm font-bold transition-all text-emerald-950/60"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : isSearching ? (
                  <div className="flex items-center justify-center py-32">
                    <div className="w-12 h-12 border-4 border-emerald-950/10 border-t-emerald-950 rounded-full animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-emerald-950/5 pb-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-950/40">
                        {searchResults.length}{" "}
                        {searchResults.length === 1 ? "Result" : "Results"}{" "}
                        found
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                      {searchResults.map((article) => (
                        <Link
                          key={article._id}
                          href={`/article/${article._id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="group flex gap-8 md:gap-12 items-center justify-between border-b border-emerald-950/5 pb-12 last:border-0"
                        >
                          <div className="flex-1 space-y-5">
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full">
                                {typeof article.category === "string"
                                  ? article.category
                                  : article.category?.name}
                              </span>

                              <span className="text-[10px] font-bold text-emerald-950/30 uppercase tracking-widest">
                                {article.readTime} read
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-3xl md:text-4xl text-emerald-950 leading-[1.2] group-hover:text-emerald-700 transition-colors">
                              {article.title}
                            </h4>

                            <p className="text-sm text-emerald-950/50 flex items-center gap-2">
                              <span>written by</span>

                              <span className="font-bold text-emerald-950/80">
                                {article.author.firstName}{" "}
                                {article.author.surname}
                              </span>
                            </p>
                          </div>

                          <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-[2.5rem] overflow-hidden bg-emerald-950/5 shadow-2xl group-hover:shadow-emerald-950/20 transition-all border border-emerald-950/5 relative">
                            <Image
                              src={article.thumbnail || "/placeholder.jpg"}
                              alt=""
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-32 space-y-6">
                    <p className="text-emerald-950/20 font-serif italic text-3xl">
                      Searching for something else?
                    </p>

                    <p className="text-emerald-950/40 font-bold uppercase tracking-[0.2em] text-xs">
                      No matches found for {searchQuery}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
