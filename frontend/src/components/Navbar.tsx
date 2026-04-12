"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/#engine", label: "AI Engine" },
  { href: "/#chronicle", label: "Chronicle" },
  { href: "/cases", label: "Cases" },
  { href: "/#contact", label: "Contact" },
];

const LANGS = ["EN", "RU", "KZ"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("EN");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/70 backdrop-blur-2xl border-b border-silver-500/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.span
            className="text-sm font-semibold tracking-[0.2em] text-silver-200 uppercase"
            style={{ fontVariantLigatures: "none" }}
            whileHover={{ color: "#fff" }}
          >
            FD GROUP
          </motion.span>
          <span className="hidden sm:block h-3 w-px bg-silver-500/20" />
          <span className="hidden sm:block text-[10px] tracking-[0.15em] text-silver-400 uppercase">
            Shield
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <Link
                href={item.href}
                className="text-[13px] text-silver-400 hover:text-silver-100 transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          {/* Lang */}
          <div className="flex items-center gap-1 ml-2 border-l border-silver-500/10 pl-5">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[11px] tracking-wider px-2 py-1 rounded transition-all ${
                  lang === l
                    ? "text-obsidian bg-silver-200 font-semibold"
                    : "text-silver-500 hover:text-silver-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
          >
            <Link href="/login" className="btn-platinum !py-2 !px-5 !text-[12px]">
              ACCESS
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden text-silver-400"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-obsidian/95 backdrop-blur-2xl border-b border-silver-500/[0.06] overflow-hidden"
        >
          <div className="px-6 py-5 flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] text-silver-400 hover:text-silver-100 py-2 tracking-wide"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" className="btn-platinum text-center mt-3 !text-[12px]" onClick={() => setOpen(false)}>
              ACCESS
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
