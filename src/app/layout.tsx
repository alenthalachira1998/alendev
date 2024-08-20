// File: src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import './styles/globals.scss'


const inter = Inter({ subsets: ["latin"] });

const digitalFont = localFont({
  src: '../../public/fonts/DigitalNumbers-Regular.ttf',
  variable: '--font-digital'
});

export const metadata: Metadata = {
  title: "Alen Software Dev",
  description: "Alen software development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${digitalFont.variable}`}>{children}</body>
    </html>
  );
}