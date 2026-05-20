import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "E-KINERJA GURU — SD N 1 Pancor",
  description: "Sistem evaluasi kinerja guru SD N 1 Pancor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
