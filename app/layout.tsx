import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Groq AI Chat",
  description: "An AI chat application using the Groq API.",
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
