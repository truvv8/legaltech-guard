"use client";

import { motion } from "framer-motion";
import { Reveal, StaggerContainer, StaggerItem } from "@/lib/motion";

const STEPS = [
  {
    phase: "01",
    title: "Incident Registered",
    desc: "Investor submits a barrier report. Data encrypted. Case ID assigned.",
    status: "complete",
  },
  {
    phase: "02",
    title: "AI Legal Analysis",
    desc: "Private RAG cross-references Entrepreneurial Code, Prosecution Law, Decree №1125.",
    status: "complete",
  },
  {
    phase: "03",
    title: "Counsel Review",
    desc: "FD Group senior counsel validates AI draft. Anti-Corruption Filter applied.",
    status: "complete",
  },
  {
    phase: "04",
    title: "Prosecutor Escalation",
    desc: "Official complaint transmitted to regional Investment Prosecutor.",
    status: "active",
  },
  {
    phase: "05",
    title: "Committee Oversight",
    desc: "Case tracked by Committee for Protection of Investors' Rights.",
    status: "pending",
  },
  {
    phase: "06",
    title: "Prosecutor Injunction",
    desc: "Binding response issued. Barrier removed. Investor rights restored.",
    status: "pending",
  },
];

export default function TrustSection() {
  return (
    <section id="chronicle" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-silver-500/20" />
            <span className="text-[11px] tracking-[0.2em] text-silver-500 uppercase">
              Case Lifecycle
            </span>
            <div className="h-px w-8 bg-silver-500/20" />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Chronicle of Justice
          </h2>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-silver-500/[0.06]" />

          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              const dotColor =
                step.status === "complete"
                  ? "bg-accent-emerald"
                  : step.status === "active"
                  ? "bg-silver-200"
                  : "bg-silver-500/30";

              return (
                <motion.div
                  key={step.phase}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Dot */}
                  <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 z-10">
                    <motion.div
                      className={`w-[9px] h-[9px] rounded-full ${dotColor} mt-2`}
                      animate={
                        step.status === "active"
                          ? { boxShadow: ["0 0 0 0 rgba(232,232,232,0.2)", "0 0 0 6px rgba(232,232,232,0)", "0 0 0 0 rgba(232,232,232,0.2)"] }
                          : {}
                      }
                      transition={step.status === "active" ? { duration: 2, repeat: Infinity } : {}}
                    />
                  </div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="glass p-5 refract">
                      <div className="flex items-center gap-3 mb-2" style={{ flexDirection: isLeft ? "row-reverse" : "row" }}>
                        <span className="text-[10px] font-mono text-silver-500 tracking-wider">
                          PHASE {step.phase}
                        </span>
                        {step.status === "active" && (
                          <span className="badge bg-silver-200/10 text-silver-200">In Progress</span>
                        )}
                      </div>
                      <h4 className="text-[14px] font-medium text-white mb-1">{step.title}</h4>
                      <p className="text-[13px] text-silver-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
