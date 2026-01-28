import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "SignLand - Real-Time Sign Language to Speech",
  description: "Privacy-first sign language to speech communication tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${manrope.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
