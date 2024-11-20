// import './globals.css'
// import { inter } from '@/components/shared/fonts'
// import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants'
// import { Metadata } from 'next'
// import { ThemeProvider } from 'next-themes'

// export const metadata: Metadata = {
//   title: {
//     template: `%s | ${APP_NAME}`,
//     default: APP_NAME,
//   },
//   description: APP_DESCRIPTION,
//   metadataBase: new URL(SERVER_URL),
// }
// export const experimental_ppr = true
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${inter.className} antialiased`}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }
// File: src/app/layout.tsx

// File: src/app/layout.tsx

// File: src/app/layout.tsx
import { Providers } from './providers'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import './styles/globals.scss'
import './styles/globals.css'


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
    <html lang="en">
          <body className={`${inter.className} ${digitalFont.variable} ${raleway.variable} bg-slate-900`}><Providers>{children}</Providers> </body>
    </html>
  );
}