import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hugo Garrigues — Portfolio",
  description: "Developer portfolio — 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
