"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, FileText, Download, AlertTriangle, Bot, Activity, Clock, CheckCircle, Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const STATUS_STEPS = [
  { key: "new", label: "Submitted" },
  { key: "ai_analyzed", label: "AI Analysis" },
  { key: "lawyer_review", label: "Legal Review" },
  { key: "escalated", label: "Escalated" },
  { key: "sent_to_committee", label: "Committee" },
  { key: "resolved", label: "Resolved" },
];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"analysis" | "draft" | "timeline">("analysis");

  useEffect(() => {
    if (id) {
      api.getCase(id).then(setCaseData).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="glass w-10 h-10 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-silver-400 animate-pulse" />
            </div>
            <p className="text-[13px] text-silver-500">Loading case data...</p>
          </div>
        </main>
      </>
    );
  }

  if (!caseData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-silver-500 mb-4">Case not found</p>
            <Link href="/cases" className="btn-platinum text-[12px]">All Cases</Link>
          </div>
        </main>
      </>
    );
  }

  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === caseData.status);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-[12px] text-silver-500 hover:text-silver-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Cases
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {caseData.priority === "sos" && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-accent-red/20 bg-accent-red/10 text-accent-red">SOS</span>
                )}
                <h1 className="text-lg font-semibold text-white">{caseData.title}</h1>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-silver-500">
                <span>{caseData.violation_type}</span>
                {caseData.region && (
                  <>
                    <span className="text-silver-500/30">|</span>
                    <span>{caseData.region}</span>
                  </>
                )}
                <span className="text-silver-500/30">|</span>
                <span>{new Date(caseData.created_at).toLocaleDateString("en-US")}</span>
              </div>
            </div>
            {caseData.ai_draft && (
              <a href={`/api/v1/cases/${id}/pdf`} className="btn-ghost text-[12px] flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </a>
            )}
          </div>

          {/* Progress */}
          <motion.div
            className="glass-strong p-6 mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[12px] font-medium text-silver-400 uppercase tracking-wider mb-5">Case Progress</p>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                          active
                            ? "bg-silver-200 border-silver-200 shadow-[0_0_8px_rgba(192,192,192,0.3)]"
                            : done
                            ? "bg-silver-500/50 border-silver-500/50"
                            : "bg-transparent border-silver-500/20"
                        }`}
                      />
                      <span className={`text-[10px] mt-2.5 text-center ${
                        active ? "text-silver-200 font-medium" : done ? "text-silver-500" : "text-silver-500/30"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-px flex-1 -mt-5 ${
                        i < currentStepIdx ? "bg-silver-500/40" : "bg-silver-500/10"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 glass rounded-lg p-1 mb-6">
            {([
              { key: "analysis" as const, label: "AI Analysis", icon: Bot },
              { key: "draft" as const, label: "Complaint Draft", icon: FileText },
              { key: "timeline" as const, label: "Timeline", icon: Activity },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 flex-1 justify-center py-2.5 text-[12px] rounded-md transition-all ${
                  tab === t.key
                    ? "bg-silver-200/10 text-silver-200 font-medium border border-silver-500/10"
                    : "text-silver-500 hover:text-silver-300"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "analysis" && (
              <div className="glass-strong p-8">
                {caseData.ai_analysis ? (
                  <>
                    <h3 className="text-[12px] font-medium text-silver-400 uppercase tracking-wider mb-4">Legal Analysis</h3>
                    <p className="text-[14px] text-silver-300 leading-relaxed whitespace-pre-wrap mb-6">
                      {caseData.ai_analysis}
                    </p>
                    {caseData.legal_references && (
                      <>
                        <h3 className="text-[12px] font-medium text-silver-400 uppercase tracking-wider mb-3">Applicable Statutes</h3>
                        <div className="flex flex-col gap-2">
                          {caseData.legal_references.split("\n").filter(Boolean).map((ref: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
                              <span className="text-[13px] text-silver-400">{ref}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Bot className="w-10 h-10 text-silver-500/30 mx-auto mb-3 animate-pulse" />
                    <p className="text-silver-400 text-[13px]">AI is analyzing your case...</p>
                    <p className="text-[12px] text-silver-500/50 mt-1">This usually takes 1-2 minutes</p>
                  </div>
                )}
              </div>
            )}

            {tab === "draft" && (
              <div className="glass-strong p-8">
                {caseData.ai_draft ? (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[12px] font-medium text-silver-400 uppercase tracking-wider">
                        Draft Complaint to Committee
                      </h3>
                      <a
                        href={`/api/v1/cases/${id}/pdf`}
                        className="text-[12px] text-silver-500 hover:text-silver-300 flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </a>
                    </div>
                    <div className="glass p-6">
                      <p className="text-[13px] text-silver-300 leading-relaxed whitespace-pre-wrap">
                        {caseData.ai_draft}
                      </p>
                    </div>
                    <p className="text-[11px] text-silver-500/40 mt-4">
                      Draft prepared by AI — will be reviewed by counsel before submission
                    </p>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="w-10 h-10 text-silver-500/30 mx-auto mb-3" />
                    <p className="text-silver-500 text-[13px]">Draft will appear after analysis completes</p>
                  </div>
                )}
              </div>
            )}

            {tab === "timeline" && (
              <div className="glass-strong p-8">
                {caseData.events?.length > 0 ? (
                  <div className="flex flex-col gap-0">
                    {caseData.events.map((event: any, i: number) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-silver-500/40 mt-1.5 border border-silver-500/20" />
                          {i < caseData.events.length - 1 && (
                            <div className="w-px flex-1 bg-silver-500/10 my-1" />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className="text-[13px] font-medium text-silver-200">
                            {event.event_type.replace(/_/g, " ")}
                          </p>
                          <p className="text-[12px] text-silver-500 mt-1">{event.description}</p>
                          <p className="text-[11px] text-silver-500/40 mt-1">
                            {new Date(event.created_at).toLocaleString("en-US")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="w-10 h-10 text-silver-500/30 mx-auto mb-3" />
                    <p className="text-silver-500 text-[13px]">No events yet</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Original description */}
          <div className="glass-strong p-8 mt-6">
            <h3 className="text-[12px] font-medium text-silver-400 uppercase tracking-wider mb-3">Original Description</h3>
            <p className="text-[13px] text-silver-400 leading-relaxed whitespace-pre-wrap">
              {caseData.description}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
