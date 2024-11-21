import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from './providers'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import './styles/globals.scss'
import './styles/globals.css'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import * as React from 'react';

const inter = Inter({ subsets: ["latin"] });

const digitalFont = localFont({
  src: '../public/fonts/DigitalNumbers-Regular.ttf',
  variable: '--font-digital'
});
const raleway = localFont({
  src: '../public/fonts/Raleway-Regular.ttf',
  variable: '--font-raleway'
});

export const metadata: Metadata = {
  title: "Alen Jose Software Dev",
  description: "I'm a fullstack web/mobile Software developer with years Of Experince especially  in Javascript based technologies. Currently i live in Waterloo Ontario",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} ${digitalFont.variable} ${raleway.variable} bg-slate-900`}>
       
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}