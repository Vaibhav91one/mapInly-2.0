import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout";
import { Preloader } from "@/components/layout/preloader";
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
    <html lang="en" suppressHydrationWarning className="bg-black">
      <head>
        {/* first visit: start at the top (else a reload restores the old scroll mid-intro). Already seen: mark html so CSS skips the intro. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('mapinly-intro')==='1'){document.documentElement.classList.add('intro-seen');history.scrollRestoration='auto'}else{history.scrollRestoration='manual';scrollTo(0,0)}}catch(e){}",
          }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased min-h-screen flex flex-col bg-foreground text-background`}
      >
        <Preloader />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <I18nProvider>
          <LocaleProviderWrapper>
            <Navbar />
            <div className={`${containerClasses} flex-1 flex flex-col overflow-visible`}>
              {children}
            </div>
          </LocaleProviderWrapper>
          </I18nProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
