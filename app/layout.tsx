import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calendly Clone",
  description: "Manage event types and scheduling preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans text-[15px] text-slate-900 sm:text-base">
        {children}
      </body>
    </html>
  );
}
