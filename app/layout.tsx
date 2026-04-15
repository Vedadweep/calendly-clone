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
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#020617] font-sans text-[15px] text-white sm:text-base">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
