'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
};

/**
 * Viewport-triggered entrance. Opacity + transform only, so it stays on the
 * compositor. Collapses to a plain fade-in when the user prefers reduced motion.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 18,
  className,
  as = 'div',
  once = true,
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.62, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-12% 0px -8% 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its RevealChild descendants. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px -6% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealChild({
  children,
  className,
  y = 20,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </MotionTag>
  );
}
