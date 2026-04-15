"use client";

import { MotionProvider } from "@/app/motion-provider";
import { FeedbackProvider } from "@/app/ui/feedback-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <FeedbackProvider>{children}</FeedbackProvider>
    </MotionProvider>
  );
}
