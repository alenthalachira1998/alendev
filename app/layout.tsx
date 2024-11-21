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
  metadataBase: new URL('https://alendev.vercel.app/'),
  title: "Alen Jose | Alen Thalachira | Software Developer",
  description: "I'm Alen Jose (Alen Thalachira), a fullstack web/mobile Software developer with years of experience in JavaScript, React, Node.js, and modern web technologies. Based in Waterloo, Ontario, specializing in building scalable applications.",
  keywords: [
    "Alen Jose",
    "Alen Thalachira",
    "Alen Jose Thalachira",
    "Software Developer",
    "Full Stack Developer",
    "Web Developer",
    "Mobile Developer",
    "JavaScript Developer",
    "React Developer",
    "Node.js Developer",
    "TypeScript",
    "Next.js",
    "Frontend Development",
    "Backend Development",
    "Waterloo",
    "Ontario",
    "Canada",
    "Software Engineering",
    "Web Applications",
    "Mobile Applications",
    "REST API",
    "Database Design",
    "UI/UX Development",
    "Cloud Computing",
    "AWS",
    "DevOps",
    "Agile Development"
  ],
  authors: [{ name: "Alen Jose Thalachira" }],
  creator: "Alen Jose Thalachira",
  publisher: "Alen Jose",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://alendev.vercel.app/",
    siteName: "Alen Jose Thalachira - Software Developer Portfolio",
    title: "Alen Jose | Alen Thalachira | Full Stack Developer Portfolio",
    description: "Professional portfolio of Alen Jose (Alen Thalachira), a Full Stack Developer based in Waterloo, Ontario. Specializing in modern web and mobile development technologies.",
    images: [
      {
        url: "/images/banner.png",
        width: 1200,
        height: 630,
        alt: "Alen Jose Thalachira - Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alen Jose | Alen Thalachira | Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies. Based in Waterloo, Ontario.",
    images: ["/images/banner.png"],
  },
  alternates: {
    canonical: "https://alenthalachira.com",
  },
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