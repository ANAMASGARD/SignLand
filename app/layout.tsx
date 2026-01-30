import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdateNotification } from "@/components/UpdateNotification";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SignLand",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#9333ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#9333ea" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        {children}
        <InstallPrompt />
        <UpdateNotification />
      </body>
    </html>
  );
}
