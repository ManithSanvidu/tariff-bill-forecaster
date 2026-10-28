import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiered Utility Tariff Predictor | Sri Lanka",
  description: "Predict end-of-month electricity and water bills, avoid slab jumps, and save with Anti-Slab Alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
