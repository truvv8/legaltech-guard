"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Shield, Upload, FileText, Image, Mic, File, Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MOCK_FILES = [
  { name: "contract_amendment_2025.pdf", type: "document", date: "15.12.2025", size: "2.4 MB" },
  { name: "inspection_notice_scan.jpg", type: "photo", date: "10.12.2025", size: "1.1 MB" },
  { name: "meeting_recording.mp3", type: "audio", date: "08.12.2025", size: "12.6 MB" },
  { name: "bank_statement.pdf", type: "document", date: "01.12.2025", size: "450 KB" },
];

const TYPE_ICONS: Record<string, typeof FileText> = {
  document: FileText, photo: Image, audio: Mic, other: File,
};

const TYPE_COLORS: Record<string, string> = {
  document: "text-accent-blue",
  photo: "text-accent-emerald",
  audio: "text-purple-400",
  other: "text-silver-500",
};

export default function VaultPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] text-silver-500 hover:text-silver-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="glass w-12 h-12 flex items-center justify-center">
              <Shield className="w-6 h-6 text-silver-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Secure Vault</h1>
              <p className="text-[12px] text-silver-500 tracking-wide">AES-256 Encrypted Document Storage</p>
            </div>
          </div>

          {/* Upload */}
          <motion.div
            className={`glass-strong p-10 text-center mb-6 border-2 border-dashed transition-all cursor-pointer ${
              dragOver ? "border-silver-400/40 bg-silver-200/5" : "border-silver-500/10 hover:border-silver-500/20"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            whileHover={{ scale: 1.005 }}
          >
            <Upload className="w-8 h-8 text-silver-500/40 mx-auto mb-3" />
            <p className="text-[13px] text-silver-400 mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-[11px] text-silver-500/50">PDF, JPG, PNG, MP3, MP4 — up to 50 MB</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-3 h-3 text-silver-500/40" />
              <span className="text-[11px] text-silver-500/40">AES-256 encrypted before storage</span>
            </div>
          </motion.div>

          {/* Files */}
          <div className="flex flex-col gap-2">
            {MOCK_FILES.map((file, i) => {
              const Icon = TYPE_ICONS[file.type] || TYPE_ICONS.other;
              const color = TYPE_COLORS[file.type] || TYPE_COLORS.other;
              return (
                <motion.div
                  key={file.name}
                  className="glass p-4 flex items-center gap-4 hover:border-silver-500/20 transition-all refract"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <div className="glass w-10 h-10 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-silver-200 truncate">{file.name}</p>
                    <p className="text-[11px] text-silver-500/50">{file.size}</p>
                  </div>
                  <span className="text-[11px] text-silver-500/40">{file.date}</span>
                  <Lock className="w-3 h-3 text-silver-500/30" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
