import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "@/components/ui/header";
import { ToastProvider } from '@/components/ui/toast';
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Mini Tuition | Premium Tutoring Platform",
  description: "Connect with expert tutors instantly for personalized 1-on-1 online learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link lang="en" rel="canonical" href="https://mini-tuition.vercel.app/" />
        <meta name="description" content="Premium tutoring platform connecting students and tutors instantly." />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ToastProvider />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
