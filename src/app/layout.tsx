import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyMate — Your personal AI study partner",
  description: "AI-powered study assistant for South African CAPS learners Grades 8–12. Smart notes, quizzes, flashcards and exam preparation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F6F7FB] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
