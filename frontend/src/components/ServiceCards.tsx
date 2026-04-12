"use client";

import Link from "next/link";
import { Brain, Terminal, Activity, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, StaggerContainer, StaggerItem } from "@/lib/motion";

export default function ServiceCards() {
  return (
    <>
      {/* ── AI Engine Section ── */}
      <section id="engine" className="py-28 px-6 relative overflow-hidden">
        {/* Animated mesh background */}
        <motion.div
          className="absolute inset-0 opacity-[0.02] -z-10"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(192,192,192,0.4) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(192,192,192,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-5">
                  <Brain className="w-5 h-5 text-silver-400" />
                  <span className="text-[11px] tracking-[0.2em] text-silver-500 uppercase">
                    Closed-Loop AI · Private RAG System
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight mb-5">
                  Legal Intelligence
                  <br />
                  <span className="text-silver-400">That Never Leaves Your Perimeter</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[15px] text-silver-500 leading-relaxed mb-8 max-w-lg">
                  Locally deployed AI processes your case against the Entrepreneurial Code,
                  Prosecution Law, and Decree №1125. Zero data leaves our infrastructure.
                  Anti-Corruption Filter applied at every stage.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <StaggerContainer className="space-y-3">
                  {[
                    "Article 153 compliance verification",
                    "Automated legal reference extraction",
                    "Draft complaint generation in minutes",
                    "Direct Line to Committee Chair",
                  ].map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-silver-400" />
                        <span className="text-[13px] text-silver-300">{item}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </Reveal>
            </div>

            {/* Right — Visual */}
            <Reveal delay={0.3}>
              <div className="glass p-8 relative">
                <div className="space-y-3">
                  {[
                    { step: "INPUT", desc: "Investor describes barrier in any language", color: "border-silver-500/20" },
                    { step: "ENCRYPT", desc: "AES-256 encryption before processing", color: "border-silver-500/15" },
                    { step: "ANALYZE", desc: "RAG retrieves applicable laws & precedents", color: "border-accent-blue/30" },
                    { step: "DRAFT", desc: "AI generates prosecutor-ready complaint", color: "border-accent-emerald/30" },
                    { step: "REVIEW", desc: "FD Group counsel validates & approves", color: "border-silver-500/20" },
                    { step: "ESCALATE", desc: "Official submission via e-Otinish", color: "border-accent-gold/30" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.step}
                      className={`glass p-4 flex items-center gap-4 border-l-2 ${s.color} refract`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span className="text-[10px] font-mono text-silver-500 w-16 shrink-0 tracking-wider">{s.step}</span>
                      <span className="text-[13px] text-silver-300">{s.desc}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Pulse line */}
                <motion.div
                  className="absolute top-8 bottom-8 left-[4.5rem] w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(192,192,192,0.08), transparent)" }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SOS Hub ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="glass-strong p-10 md:p-14 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="w-5 h-5 text-accent-red" />
                    <span className="text-[11px] tracking-[0.2em] text-accent-red uppercase font-medium">
                      Emergency Protocol
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
                    Report Immediate Barrier
                  </h3>
                  <p className="text-[14px] text-silver-500 leading-relaxed mb-6">
                    Unlawful inspection. Account seizure. Permit extortion.
                    Our system encrypts your report, triggers AI analysis, and alerts
                    an investment prosecutor within the hour.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/sos" className="btn-danger inline-flex">
                      <Shield className="w-4 h-4" />
                      Activate SOS Protocol
                    </Link>
                  </motion.div>
                </div>
                <div className="hidden md:flex flex-col gap-3">
                  {[
                    { type: "CORRUPTION", code: "Art. 366 UK RK" },
                    { type: "ILLEGAL INSPECTION", code: "Art. 144 PK RK" },
                    { type: "ACCOUNT BLOCKING", code: "Art. 741 GK RK" },
                    { type: "PROPERTY SEIZURE", code: "Art. 26 Constitution" },
                  ].map((item) => (
                    <div key={item.type} className="glass p-3 flex items-center justify-between refract">
                      <span className="text-[12px] text-silver-300 tracking-wide">{item.type}</span>
                      <span className="text-[10px] font-mono text-silver-500">{item.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Background glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-red/[0.03] rounded-full blur-[100px]" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
