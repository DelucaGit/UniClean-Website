import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "dark" | "accent" | "white";
  size?: "default" | "pill";
  href?: string;
  track?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

const variants = {
  dark: "bg-dark text-white",
  accent: "bg-accent text-white",
  white: "bg-white text-ink",
};

const sizes = {
  default: "rounded-[10px] px-[22px] py-[14px] text-[16px]",
  pill: "rounded-full px-[16px] py-[9px] text-[14.5px]",
};

export function Button({
  children,
  variant = "dark",
  size = "default",
  href,
  track,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-[8px] border-0 font-extrabold whitespace-nowrap transition-opacity duration-150 hover:opacity-[.88] ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} data-track={track} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} data-track={track} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
