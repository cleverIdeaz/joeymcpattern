import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FontAwesomeProvider from "@/components/FontAwesomeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marble Plastics Sheet Designer",
  description: "Create your perfect recycled plastic sheet design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#121212] text-white antialiased`}>
        <FontAwesomeProvider>
          {children}
        </FontAwesomeProvider>
      </body>
    </html>
  );
}
