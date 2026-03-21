import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { WallpaperProvider } from "@/contexts/WallpaperContext";
import { AvailabilityProvider } from "@/contexts/AvailabilityContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationCenterProvider } from "@/contexts/NotificationCenterContext";
import { NotificationCenter } from "@/components/system/notifications/NotificationCenter";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.personName} | ${siteConfig.siteName}`,
    template: `%s | ${siteConfig.personName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  authors: [{ name: siteConfig.personName, url: siteConfig.url }],
  creator: siteConfig.personName,
  publisher: siteConfig.personName,
  category: "portfolio",
  keywords: [...siteConfig.keywords],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <ThemeProvider>
          <NotificationCenterProvider>
            <LocaleProvider>
              <WallpaperProvider>
                <AvailabilityProvider>
                  {children}
                  <NotificationCenter />
                </AvailabilityProvider>
              </WallpaperProvider>
            </LocaleProvider>
          </NotificationCenterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
