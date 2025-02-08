import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
  description: "A habit-tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full min-h-dvh relative`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
