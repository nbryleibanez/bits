import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bits",
  description: "A habit-tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-full min-h-dvh max-h-dvh relative`}
      >
        <NextTopLoader color="#0f172a" showSpinner={false} />
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
