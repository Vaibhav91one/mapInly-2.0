import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout";
import { AuthProvider } from "@/components/providers/auth-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { LocaleProviderWrapper } from "@/components/locale/locale-provider-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { containerClasses } from "@/lib/layout-classes";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteDescription =
  "Discover events and community forums. Join in your language with automatic translations.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Mapinly",
    template: "%s | Mapinly",
  },
  description: siteDescription,
  icons: {
    icon: "/svgs/Asterisk.svg",
    apple: "/svgs/Asterisk.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Mapinly",
    title: "Mapinly",
    description: siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapinly",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col bg-foreground text-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider>
          <LocaleProviderWrapper>
          <AuthProvider>
            <Navbar />
            <div className={`${containerClasses} flex-1 flex flex-col overflow-visible`}>
              {children}
            </div>
          </AuthProvider>
          </LocaleProviderWrapper>
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
