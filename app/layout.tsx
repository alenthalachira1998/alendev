import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from './providers'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import './styles/globals.scss'
import './styles/globals.css'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import * as React from 'react';
import { Analytics } from '@vercel/analytics/react';
import GoogleVerification from './components/GoogleVerification';

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
  title: {
    default: "Alen Jose | Alen Thalachira | Software Developer",
    template: "%s | Alen Jose",
  },
  description: "I'm Alen Jose, Allen Jose (Alen Thalachira), a fullstack web/mobile Software developer with years of experience in JavaScript, React, Node.js, and modern web technologies. Based in Waterloo, Ontario, specializing in building scalable applications.",
  keywords: [
    "Alen Jose",
    "Allen Jose",
    "Alen Thalachira",
    "Alen Jose Thalachira",
    "Software Developer Waterloo",
    "Full Stack Developer Ontario",
    "Web Developer Canada",
    "Mobile Developer Waterloo",
    "JavaScript Developer Ontario",
    "React Developer Canada",
    "Node.js Developer",
    "TypeScript Expert",
    "Next.js Developer",
    "Frontend Development",
    "Backend Development",
    "Waterloo Software Engineer",
    "Ontario Tech Professional",
    "Canada Developer",
    "Web Applications Expert",
    "Mobile Applications Developer",
    "REST API Developer",
    "Database Design Expert",
    "UI/UX Development",
    "Cloud Computing AWS",
    "DevOps Engineer",
    "Agile Development Expert"
  ],
  authors: [{ 
    name: "Alen Jose Thalachira",
    url: "https://github.com/alenthalachira1998"
  }],
  creator: "Alen Jose Thalachira",
  publisher: "Alen Jose",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        alt: "Alen Jose Thalachira - Software Developer Portfolio",
        type: "image/png",
      },
    ]
  },
  alternates: {
    canonical: "https://alenthalachira.com",
    languages: {
      'en-US': 'https://alendev.vercel.app',
      'en-CA': 'https://alendev.vercel.app'
    },
  },
  verification: {
    google: "IlGE16h2m3PyUgb_FNU3go58vBiXv60KZQLrFx7qqZw",
    other: {
      me: [
        'https://github.com/alenthalachira1998',
        'https://www.linkedin.com/in/alen-j-723156272/'
      ]
    }
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <GoogleVerification />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" href="https://alendev.vercel.app/" />
          <link rel="me" href="https://github.com/alenthalachira1998" />
          <link rel="me" href="https://www.linkedin.com/in/alen-j-723156272/" />
        </head>
        <body className={`${inter.className} ${digitalFont.variable} ${raleway.variable} bg-slate-900`}>
          <Providers>
            {children}
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}