import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://event.chow.my.id/"),
  title: {
    default: "myITS Event",
    template: "%s • myITS Event",
  },
  description:
    "myITS Event adalah platform untuk mengelola dan mengikuti berbagai acara di ITS, termasuk peminjaman ruangan, penyebaran undangan seminar, workshop, dan konferensi. Dapatkan informasi terkini tentang acara yang akan datang, daftar sebagai peserta, dan ikuti perkembangan acara secara real-time.",
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  authors: [
    {
      name: "myITS Event",
      url: "https://event.chow.my.id/",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
