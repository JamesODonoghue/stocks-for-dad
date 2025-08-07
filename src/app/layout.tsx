import "~/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/navbar";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Ulti score",
  description: "Ultimate score keeper",
  icons: [{ rel: "icon", url: "favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <body className={`dark font-sans ${inter.variable} gap-8`}>
          <Navbar></Navbar>
          {children}
          <SpeedInsights />
          <Analytics />
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
