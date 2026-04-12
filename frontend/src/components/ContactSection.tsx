"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Shield, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SlideIn } from "@/lib/motion";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left */}
        <SlideIn from="left">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-silver-500/20" />
              <span className="text-[11px] tracking-[0.2em] text-silver-500 uppercase">
                Secure Channel
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-5">
              Establish Contact
            </h2>
            <p className="text-[15px] text-silver-500 leading-relaxed mb-10 max-w-md">
              All communications are privileged under attorney-client confidentiality
              and encrypted end-to-end.
            </p>
          </Reveal>

          <div className="space-y-5">
            {[
              { icon: Phone, label: "+7 7172 XXX XX XX", sub: "Mon — Fri, 09:00 — 18:00 (Astana)" },
              { icon: Mail, label: "secure@fd-group.kz", sub: "Encrypted correspondence preferred" },
              { icon: MapPin, label: "Astana, Mangilik El Ave 55/22", sub: "Talan Towers, 14th Floor" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="glass w-10 h-10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-silver-400" />
                </div>
                <div>
                  <p className="text-[14px] text-silver-200">{item.label}</p>
                  <p className="text-[12px] text-silver-500 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SlideIn>

        {/* Right — Form */}
        <SlideIn from="right">
          <div className="glass-strong p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle className="w-10 h-10 text-accent-emerald mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-white mb-2">Message Transmitted</h3>
                  <p className="text-[13px] text-silver-500">Our team will respond within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" className="input-field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Email</label>
                    <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea rows={4} className="input-field resize-none" placeholder="Describe your situation..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-silver-500/60 mb-2">
                    <Shield className="w-3 h-3" />
                    End-to-end encrypted transmission
                  </div>
                  <motion.button type="submit" className="btn-platinum w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    TRANSMIT SECURELY
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
