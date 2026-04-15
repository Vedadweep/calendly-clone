"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  motion,
  useMotionValueEvent,
  useScroll,
  type HTMLMotionProps,
} from "framer-motion";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export const pageTransition = {
  duration: 0.6,
  ease,
};

export const revealTransition = {
  duration: 0.55,
  ease,
};

export const interactionTransition = {
  duration: 0.24,
  ease,
};

type ChildrenProps = {
  children: React.ReactNode;
};

type AnimatedPageProps = ChildrenProps & {
  className?: string;
};

type RevealProps = ChildrenProps & {
  className?: string;
  delay?: number;
};

export function MotionProvider({ children }: ChildrenProps) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton(props: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, filter: "brightness(1.08)" }}
      whileTap={{ scale: 0.95 }}
      transition={interactionTransition}
      {...props}
    />
  );
}

export function HoverCard({
  children,
  className,
  hoverScale = 1.05,
}: {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: -8,
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.16)",
      }}
      transition={interactionTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function InteractiveShell({
  children,
  className,
  hoverScale = 1.05,
  tapScale = 0.95,
}: {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, filter: "brightness(1.08)" }}
      whileTap={{ scale: tapScale }}
      transition={interactionTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type ScrollShadowHeaderProps = ChildrenProps & {
  className?: string;
  threshold?: number;
};

export function ScrollShadowHeader({
  children,
  className,
  threshold = 12,
}: ScrollShadowHeaderProps) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > threshold);
  });

  return (
    <motion.header
      animate={{
        boxShadow: scrolled
          ? "0 18px 48px rgba(15, 23, 42, 0.08)"
          : "0 0 0 rgba(15, 23, 42, 0)",
      }}
      transition={interactionTransition}
      className={className}
    >
      {children}
    </motion.header>
  );
}
