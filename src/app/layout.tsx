import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real-Time Chat App",
  description: "A real-time chat application built with Next.js, TypeScript, Tailwind CSS, and Socket.IO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
