import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Groq AI Chat",
  description: "An AI chat application using the Groq API.",
  openGraph: {
    title: "Groq AI Chat",
    description: "An AI chat application using the Groq API.",
    url: "/",
    siteName: "Groq AI Chat",
    images: [
      { url: "/mobilegroq.png", width: 1200, height: 630, alt: "Groq AI Chat" },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groq AI Chat",
    description: "An AI chat application using the Groq API.",
    images: ["/mobilegroq.png"],
  },
  icons: {
    icon: [
      { url: "/mobilegroq.png", type: "image/png", sizes: "32x32" },
      { url: "/mobilegroq.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/mobilegroq.png"],
    apple: ["/mobilegroq.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
