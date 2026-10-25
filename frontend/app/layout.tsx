import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intervue – Smart Interview Preparation",
  description: "AI-powered mock interviews with ML answer evaluation and skill-gap detection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
