import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";
import { AvailabilityProvider } from "@/contexts/AvailabilityContext";

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
    <html lang="fr">
      <body className="antialiased">
        <LocaleProvider>
          <WallpaperProvider>
            <AvailabilityProvider>
              {children}
            </AvailabilityProvider>
          </WallpaperProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
