import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/app/providers";

export const metadata: Metadata = {
  title: "Cal Studio",
  description: "A polished scheduling workspace for events, availability, and bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full font-sans text-[15px] text-slate-900 transition-colors duration-300 sm:text-base">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
