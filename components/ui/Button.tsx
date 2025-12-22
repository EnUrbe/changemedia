"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const MotionLink = motion.create(Link);

type ButtonVariant = "primary" | "ghost" | "soft";
type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

type ButtonProps = BaseProps &
  (
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black border border-transparent hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/5",
  ghost:
    "bg-transparent text-current hover:opacity-60",
  soft:
    "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:border-white/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[11px]",
  lg: "h-12 px-6 text-[12px]",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    icon,
    trailingIcon,
    fullWidth,
    href,
    ...rest
  } = props;
  const prefersReducedMotion = useReducedMotion();

  const shared =
    `inline-flex items-center justify-center gap-2 rounded-full uppercase tracking-[0.24em] font-semibold ` +
    `transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-white ` +
    `${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const motionProps = prefersReducedMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.99 } };

  if (href) {
    return (
      <MotionLink href={href} className={shared} {...motionProps} {...(rest as any)}>
        {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
        <span>{children}</span>
        {trailingIcon && <span className="flex h-4 w-4 items-center justify-center">{trailingIcon}</span>}
      </MotionLink>
    );
  }

  return (
    <motion.button className={shared} {...motionProps} {...(rest as any)}>
      {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="flex h-4 w-4 items-center justify-center">{trailingIcon}</span>}
    </motion.button>
  );
}
