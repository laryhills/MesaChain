import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "../components/MesaSidebar";
import MainContent from "../components/layout/MainContent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MesaChain",
  description: "MesaChain - Blockchain Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Sidebar />
        <MainContent>{children}</MainContent>
      </body>
    </html>
  );
}
