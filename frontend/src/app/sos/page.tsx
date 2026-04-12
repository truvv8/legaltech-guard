"use client";

import { useState } from "react";
import { AlertTriangle, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const VIOLATIONS = [
  { value: "corruption", label: "Corruption / Extortion", code: "Art. 366 UK RK" },
  { value: "illegal_inspection", label: "Illegal Business Inspection", code: "Art. 144 PK RK" },
  { value: "account_blocking", label: "Unlawful Account Blocking", code: "Art. 741 GK RK" },
  { value: "permit_denial", label: "Unjustified Permit Denial", code: "Art. 27 PK RK" },
  { value: "property_seizure", label: "Illegal Property Seizure", code: "Art. 26 Constitution" },
  { value: "other", label: "Other Barrier", code: "" },
];

const REGIONS = [
  "Astana", "Almaty", "Shymkent", "Akmola", "Aktobe", "Almaty Region",
  "Atyrau", "East Kazakhstan", "Zhambyl", "West Kazakhstan", "Karaganda",
  "Kostanay", "Kyzylorda", "Mangystau", "North Kazakhstan", "Pavlodar",
  "Turkestan", "Ulytau", "Zhetisu", "Abai",
];

export default function SOSPage() {
  const [form, setForm] = useState({ title: "", description: "", violation_type: "", region: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.sosReport(form);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Transmission failed. Contact FD Group directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-silver-500 hover:text-silver-300 transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          {submitted ? (
            <motion.div className="glass-strong p-12 text-center" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="w-12 h-12 text-accent-emerald mx-auto mb-5" />
              <h1 className="text-xl font-semibold text-white mb-3">SOS Report Transmitted</h1>
              <p className="text-[14px] text-silver-500 mb-2">Your report has been encrypted and transmitted to FD Group.</p>
              <p className="text-[14px] text-silver-500 mb-8">AI analysis initiated. Counsel will review within 2 hours.</p>
              <Link href="/cases" className="btn-platinum">View Cases</Link>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-8">
                <div className="glass w-12 h-12 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-accent-red" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Report Immediate Barrier</h1>
                  <p className="text-[12px] text-silver-500 tracking-wide">Emergency Protocol · Priority Escalation</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 border border-accent-red/20 bg-accent-red/5 rounded-card text-[13px] text-accent-red">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="glass-strong p-8 space-y-5">
                <div>
                  <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Violation Type *</label>
                  <select className="input-field" value={form.violation_type} onChange={(e) => setForm({ ...form, violation_type: e.target.value })} required>
                    <option value="">Select violation type...</option>
                    {VIOLATIONS.map((v) => (
                      <option key={v.value} value={v.value}>{v.label}{v.code ? ` — ${v.code}` : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Jurisdiction</label>
                  <select className="input-field" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    <option value="">Select region...</option>
                    {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Subject *</label>
                  <input type="text" className="input-field" placeholder="Brief description of the barrier" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Detailed Account *</label>
                  <textarea className="input-field resize-none" rows={6} placeholder="Describe the incident: timeline, parties involved, evidence available..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-silver-500/50">
                  <Shield className="w-3 h-3" /> AES-256 encrypted before transmission
                </div>
                <motion.button type="submit" disabled={loading} className="btn-danger w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  {loading ? "ENCRYPTING..." : "TRANSMIT SOS REPORT"}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
