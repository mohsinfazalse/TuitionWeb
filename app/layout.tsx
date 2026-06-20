import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "react-hot-toast";
import Header from "@/components/ui/header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mini-tuition",
  description: "Premium tutoring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastProvider>
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}> 
          <body className="min-h-full flex flex-col bg-background text-foreground">
            <Header />
            {children}
          </body>
        </html>
      </ToastProvider>
    </ThemeProvider>
  );
}
