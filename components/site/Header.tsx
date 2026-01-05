"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

function BrandMark() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative h-9 w-9"
      initial={false}
      animate={
        reduceMotion
          ? {}
          : {
              y: [0, -1.5, 0],
            }
      }
      transition={
        reduceMotion
          ? {}
          : {
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
      whileHover={reduceMotion ? {} : { rotate: -2, scale: 1.03 }}
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
    >
      <Image
        src="/brand/gotempcover.svg"
        alt="GoTempCover"
        width={36}
        height={36}
        priority
        className="h-9 w-9"
      />
    </motion.div>
  );
}

const NAV = [
  { href: "/car", label: "Car" },
  { href: "/van", label: "Van" },
  { href: "/learner", label: "Learner" },
  { href: "/impound", label: "Impound" },
  { href: "/more", label: "More" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-blue-200/40"
          aria-label="GoTempCover home"
        >
          <BrandMark />

          {/* Desktop brand text */}
          <div className="leading-tight hidden sm:block">
            <div className="text-[15px] font-extrabold tracking-tight text-slate-900 font-tan">
              GoTempCover
            </div>
            <div className="text-[11px] text-slate-500">
              Temporary cover, simplified.
            </div>
          </div>

          {/* Mobile brand text */}
          <div className="leading-tight sm:hidden">
            <div className="text-[15px] font-extrabold tracking-tight text-slate-900 font-tan">
              GoTempCover
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} className="link text-sm" href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="link text-sm" href="/retrieve-policy">
            Retrieve
          </Link>
          <Link className="link text-sm" href="/help-support">
            Help
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger (ghost/light) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost btn-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>

          {/* Desktop secondary (ghost/light) */}
          <Link className="btn-ghost hidden md:inline-flex" href="/retrieve-policy">
            Retrieve policy
          </Link>

          {/* Primary CTA */}
          <Link className="btn-primary" href="/get-quote">
            Get a quote
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-slate-200/70 bg-white/90 backdrop-blur"
        >
          <div className="container-app py-4">
            <div className="grid gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="btn-ghost justify-start w-full"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/retrieve-policy"
                onClick={() => setOpen(false)}
                className="btn-ghost justify-start w-full"
              >
                Retrieve policy
              </Link>

              <Link
                href="/help-support"
                onClick={() => setOpen(false)}
                className="btn-ghost justify-start w-full"
              >
                Help centre
              </Link>

              <Link
                href="/get-quote"
                onClick={() => setOpen(false)}
                className="btn-primary justify-center mt-2 w-full"
              >
                Get a quote
              </Link>
            </div>

            <div className="mt-3 text-[12px] text-slate-500">
              Secure checkout • Instant documents • Self-serve retrieval
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
