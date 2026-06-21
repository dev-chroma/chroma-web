import Link from "next/link";
import Image from "next/image";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Notification from "@/models/Notification";
import UserSection from "./UserSection";
import { ChevronDown } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
}

export default async function Header() {
  await connectDB();

  const user = await getCurrentUser();

  let notifications: Notification[] = [];

  if (user) {
    notifications = await Notification.find({
      $or: [{ isGlobal: true }, { recipients: user._id }],
    })
      .sort({ createdAt: -1 })
      .lean();
  }

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
      path: "#",
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

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-cream-50/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* LOGO */}

        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={60}
            className="h-12 md:h-16 w-auto"
            priority
          />
        </Link>

        {/* NAV */}

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.name} className="relative group py-4">
              <Link
                href={item.path}
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-emerald-950/60 hover:text-emerald-950 transition-colors"
              >
                {item.name}

                {item.dropdown && (
                  <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                )}
              </Link>

              {item.dropdown && (
                <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="w-64 bg-white rounded-2xl border border-emerald-950/10 shadow-2xl p-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className="block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950/60 hover:text-emerald-950 hover:bg-emerald-950/5 transition-all"
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

        {/* USER */}

        <UserSection
          user={user}
          notifications={JSON.parse(JSON.stringify(notifications))}
        />
      </div>
    </header>
  );
}
