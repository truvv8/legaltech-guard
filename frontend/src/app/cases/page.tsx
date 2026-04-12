"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, AlertTriangle, Clock, ChevronRight, Plus, Inbox, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "text-accent-blue border-accent-blue/20 bg-accent-blue/10" },
  ai_analyzed: { label: "AI Analyzed", color: "text-purple-400 border-purple-400/20 bg-purple-400/10" },
  lawyer_review: { label: "Lawyer Review", color: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
  escalated: { label: "Escalated", color: "text-accent-red border-accent-red/20 bg-accent-red/10" },
  sent_to_committee: { label: "Sent to Committee", color: "text-accent-emerald border-accent-emerald/20 bg-accent-emerald/10" },
  resolved: { label: "Resolved", color: "text-accent-emerald border-accent-emerald/20 bg-accent-emerald/10" },
  closed: { label: "Closed", color: "text-silver-500 border-silver-500/20 bg-silver-500/10" },
};

const PRIORITY_ICONS: Record<string, { icon: typeof FileText; color: string }> = {
  sos: { icon: AlertTriangle, color: "text-accent-red" },
  high: { icon: AlertTriangle, color: "text-amber-400" },
  normal: { icon: FileText, color: "text-silver-500" },
  low: { icon: Clock, color: "text-silver-500/50" },
};

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listCases().then(setCases).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-white">Case Dashboard</h1>
              <p className="text-[13px] text-silver-500 mt-1">All reports and their current status</p>
            </div>
            <Link href="/sos" className="btn-danger text-[12px] flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              New Report
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="glass w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-silver-400 animate-pulse" />
              </div>
              <p className="text-[13px] text-silver-500">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <motion.div
              className="glass-strong p-14 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Inbox className="w-12 h-12 text-silver-500/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Cases Yet</h3>
              <p className="text-silver-500 text-[13px] mb-6">
                When you submit a report, it will appear here
              </p>
              <Link href="/sos" className="btn-platinum text-[12px]">
                Report an Issue
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {cases.map((c, i) => {
                const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
                const priority = PRIORITY_ICONS[c.priority] || PRIORITY_ICONS.normal;
                const PIcon = priority.icon;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={`/cases/${c.id}`}
                      className="glass p-5 flex items-center gap-4 group hover:border-silver-500/20 transition-all refract block"
                    >
                      <div className={`glass w-10 h-10 flex items-center justify-center shrink-0`}>
                        <PIcon className={`w-4 h-4 ${priority.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-medium text-silver-200 truncate">{c.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] text-silver-500">{c.violation_type}</span>
                          {c.region && <span className="text-[11px] text-silver-500/50">{c.region}</span>}
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-[11px] text-silver-500/50 hidden sm:block">
                        {new Date(c.created_at).toLocaleDateString("en-US")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-silver-500/30 group-hover:text-silver-400 transition-colors" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
