"use client";

import Link from "next/link";
import { Reveal } from "@/lib/motion";

export default function Footer() {
  return (
    <footer className="border-t border-silver-500/[0.06] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal y={12}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <span className="text-[13px] tracking-[0.15em] text-silver-500 uppercase font-medium">
              FD Group · Shield
            </span>
            <div className="flex flex-wrap gap-6">
              {[
                { href: "/#engine", label: "AI Engine" },
                { href: "/#chronicle", label: "Chronicle" },
                { href: "/cases", label: "Cases" },
                { href: "/chat", label: "AI Counsel" },
                { href: "/#contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-[12px] text-silver-500/60 hover:text-silver-300 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="divider mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-silver-500/40">
              &copy; {new Date().getFullYear()} FD Group. All rights reserved. Confidential.
            </p>
            <p className="text-[11px] text-silver-500/40">
              Astana, Republic of Kazakhstan · ISO 27001 Compliant
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
