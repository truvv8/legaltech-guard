import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FD Group — Sovereign Investment Protection",
  description:
    "The Digital Fortress. AI-powered sovereign protection for global capital in Kazakhstan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen grain">{children}</body>
    </html>
  );
}
