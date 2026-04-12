"use client";

import Link from "next/link";
import { ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Parallax, StaggerContainer, StaggerItem } from "@/lib/motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-14 overflow-hidden">
      {/* Mesh grid background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          animate={{ rotate: [0, 0.3, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(192,192,192,0.3) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(192,192,192,0.3) 0.5px, transparent 0.5px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/60 to-obsidian" />
      </div>

      {/* Ambient orbs */}
      <Parallax speed={0.15} className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-[20%] right-[15%] w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(8,20,36,0.8) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] left-[10%] w-[250px] h-[250px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,192,192,0.04) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </Parallax>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <div>
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <div className="h-px w-8 bg-silver-500/30" />
            <span className="text-[11px] tracking-[0.2em] text-silver-400 uppercase">
              Prosecutorial Oversight · Decree №1125
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold text-white leading-[1.15] tracking-[-0.02em] mb-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            Sovereign Protection
            <br />
            for{" "}
            <span className="text-silver-300">Global Capital</span>
          </motion.h1>

          <motion.p
            className="text-[15px] text-silver-400 leading-relaxed mb-10 max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
          >
            Direct conduit to the Committee for Protection of Investors&apos; Rights
            under the Prosecutor General&apos;s Office. AI-driven legal analysis.
            Article 153 compliance enforcement. End-to-end encryption.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/sos" className="btn-danger flex items-center">
                <AlertTriangle className="w-4 h-4" />
                Report Immediate Barrier
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/chat" className="btn-ghost flex items-center">
                Consult AI Counsel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Indicators */}
          <StaggerContainer className="flex gap-8">
            {[
              { label: "Active Jurisdictions", value: "17" },
              { label: "Cases Processed", value: "500+" },
              { label: "Avg Response", value: "< 24h" },
            ].map((s) => (
              <StaggerItem key={s.label}>
                <div>
                  <div className="text-xl font-semibold text-white tracking-tight">{s.value}</div>
                  <div className="text-[11px] text-silver-500 tracking-wide uppercase mt-1">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Right — Tactical Dashboard Preview */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
        >
          <div className="glass-strong p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-silver-300" />
                <span className="text-[12px] tracking-[0.15em] text-silver-300 uppercase font-medium">
                  Protection Status
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-accent-emerald"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[11px] text-accent-emerald tracking-wide font-medium">ACTIVE</span>
              </div>
            </div>

            {/* Mock metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Open Cases", value: "12", trend: "+3" },
                { label: "Under Review", value: "5", trend: "" },
                { label: "Resolved (Q1)", value: "47", trend: "+12" },
              ].map((m) => (
                <div key={m.label} className="glass p-4">
                  <div className="text-[10px] text-silver-500 tracking-wider uppercase mb-2">{m.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-white">{m.value}</span>
                    {m.trend && <span className="text-[10px] text-accent-emerald">{m.trend}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock case rows */}
            <div className="space-y-2">
              {[
                { id: "INV-0847", type: "Account Blocking", status: "Escalated", color: "text-accent-red bg-accent-red/10" },
                { id: "INV-0842", type: "Illegal Inspection", status: "AI Analyzed", color: "text-accent-blue bg-accent-blue/10" },
                { id: "INV-0839", type: "Permit Denial", status: "Resolved", color: "text-accent-emerald bg-accent-emerald/10" },
              ].map((c) => (
                <div key={c.id} className="glass p-3 flex items-center gap-3 refract">
                  <span className="text-[11px] text-silver-500 font-mono w-16">{c.id}</span>
                  <span className="text-[12px] text-silver-300 flex-1">{c.type}</span>
                  <span className={`badge ${c.color}`}>{c.status}</span>
                </div>
              ))}
            </div>

            {/* Glow line */}
            <motion.div
              className="absolute bottom-0 left-6 right-6 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(192,192,192,0.15), transparent)" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
