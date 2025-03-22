import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MesaChainSidebar from "../components/SideBar";
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
      <body className={inter.className}>
        <MesaChainSidebar />
        {children}
      </body>
    </html>
  );
}
