import type { ReactNode } from "react";

type TextLinkProps = {
  children: ReactNode;
  href: string;
  track?: string;
  className?: string;
};

export function TextLink({ children, href, track, className = "" }: TextLinkProps) {
  return (
    <a
      href={href}
      data-track={track}
      className={`border-b border-current pb-[2px] font-bold hover:opacity-70 ${className}`}
    >
      {children}
    </a>
  );
}
