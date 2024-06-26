import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import NavBar from "@/components/nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bits",
  description: "Your research-based habit tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative p-5`}>
        {children}
        <NavBar />
      </body>
    </html>
  );
}
