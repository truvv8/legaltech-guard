"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string };

const QUICK = [
  "What are my rights under Decree №1125?",
  "How to challenge an illegal inspection?",
  "Account blocked without notice — what to do?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "FD Legal AI online. I specialize in Kazakhstan investment law — Entrepreneurial Code, Prosecution Law, Decree №1125.\n\nDescribe your situation. All data remains within our secure perimeter.",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const { reply } = await api.chat(msg);
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "System unavailable. Contact secure@fd-group.kz directly." }]);
    } finally { setLoading(false); }
  };

  const showQuick = messages.length <= 1 && !loading;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 flex flex-col">
        <div className="border-b border-silver-500/[0.06] px-6 py-3.5 flex items-center gap-3">
          <Link href="/" className="text-silver-500 hover:text-silver-300 transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div className="glass w-8 h-8 flex items-center justify-center"><Bot className="w-4 h-4 text-silver-400" /></div>
          <div>
            <h1 className="text-[13px] font-medium text-silver-200">FD Legal AI Counsel</h1>
            <div className="flex items-center gap-1.5"><Lock className="w-2.5 h-2.5 text-silver-500/50" /><span className="text-[10px] text-silver-500/50">Private · On-premise</span></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {m.role === "assistant" && <div className="glass w-7 h-7 flex items-center justify-center shrink-0 mt-1"><Bot className="w-3.5 h-3.5 text-silver-400" /></div>}
              <div className={`max-w-[80%] rounded-card px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "bg-silver-200/10 text-silver-200 border border-silver-500/10" : "glass text-silver-300"
              }`}>{m.content}</div>
              {m.role === "user" && <div className="glass w-7 h-7 flex items-center justify-center shrink-0 mt-1"><User className="w-3.5 h-3.5 text-silver-400" /></div>}
            </motion.div>
          ))}

          {showQuick && (
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK.map((q) => (
                <button key={q} onClick={() => handleSend(q)} className="px-3.5 py-2 glass text-[12px] text-silver-400 hover:text-silver-200 hover:border-silver-500/20 transition-all refract">{q}</button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex gap-3">
              <div className="glass w-7 h-7 flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5 text-silver-400" /></div>
              <div className="glass px-4 py-3 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-silver-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-silver-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-silver-500 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-silver-500/[0.06] px-6 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input type="text" className="input-field flex-1" placeholder="Describe your situation..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} />
            <motion.button onClick={() => handleSend()} disabled={loading || !input.trim()} className="btn-platinum !px-4 disabled:opacity-20" whileTap={{ scale: 0.95 }}>
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </main>
    </>
  );
}
