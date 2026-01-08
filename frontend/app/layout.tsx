import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "./components/ui/sonner";
import { Header } from "@/components/layout/header";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Harvest - Movement Rewards Aggregator",
  description:
    "Track, claim, and auto-compound rewards across the Movement ecosystem",
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
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
