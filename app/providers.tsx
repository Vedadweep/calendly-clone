"use client";

import { MotionProvider } from "@/app/motion-provider";
import { FeedbackProvider } from "@/app/ui/feedback-provider";
import { ThemeProvider } from "@/app/ui/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <FeedbackProvider>{children}</FeedbackProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
