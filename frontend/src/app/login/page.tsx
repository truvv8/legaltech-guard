"use client";

import { useState } from "react";
import { Shield, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    email: "", password: "", full_name: "", company_name: "", phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = tab === "login"
        ? await api.login(form.email, form.password)
        : await api.register(form);
      localStorage.setItem("fd_token", res.access_token);
      router.push("/cases");
    } catch (err: any) {
      setError(err.message || "Authorization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] text-silver-500 hover:text-silver-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          <motion.div
            className="glass-strong p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="glass w-11 h-11 flex items-center justify-center">
                <Shield className="w-5 h-5 text-silver-400" />
              </div>
            </div>
            <h1 className="text-lg font-semibold text-white text-center mb-1">
              {tab === "login" ? "Secure Access" : "Create Account"}
            </h1>
            <p className="text-[13px] text-silver-500 text-center mb-6">
              {tab === "login"
                ? "Authenticate to access your case dashboard"
                : "Registration takes a moment"}
            </p>

            {/* Tabs */}
            <div className="flex glass rounded-lg p-1 mb-6">
              <button
                className={`flex-1 py-2.5 text-[13px] font-medium rounded-md transition-all ${
                  tab === "login"
                    ? "bg-silver-200/10 text-silver-200 border border-silver-500/10"
                    : "text-silver-500 hover:text-silver-300"
                }`}
                onClick={() => setTab("login")}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2.5 text-[13px] font-medium rounded-md transition-all ${
                  tab === "register"
                    ? "bg-silver-200/10 text-silver-200 border border-silver-500/10"
                    : "text-silver-500 hover:text-silver-300"
                }`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 border border-accent-red/20 bg-accent-red/5 rounded-card text-[13px] text-accent-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "register" && (
                <>
                  <div>
                    <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text" className="input-field" placeholder="Your full name"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Company</label>
                    <input
                      type="text" className="input-field" placeholder="Optional"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email" className="input-field" placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] text-silver-500 uppercase tracking-wider mb-2">Password *</label>
                <input
                  type="password" className="input-field" placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-silver-500/50">
                <Lock className="w-3 h-3" /> End-to-end encrypted session
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                className="btn-platinum w-full mt-1 disabled:opacity-30"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "AUTHENTICATING..." : tab === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
