import type { ReactNode } from "react";
import type { ServiceId } from "@/content/services";

const paths: Record<ServiceId, ReactNode> = {
  hemstad: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  storstad: (
    <>
      <path d="M5 9h14l-1.500 11h-11z" />
      <path d="M7 9a5 5 0 0110 0" />
    </>
  ),
  flyttstad: (
    <>
      <path d="M3 8l9-4 9 4v9l-9 4-9-4z" />
      <path d="M3 8l9 4 9-4M12 12v9" />
    </>
  ),
  fonsterputs: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18M4 12h16" />
    </>
  ),
};

type ServiceIconProps = {
  id: ServiceId;
  className?: string;
};

export function ServiceIcon({ id, className = "" }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[34px] w-[34px] stroke-ink ${className}`}
    >
      {paths[id]}
    </svg>
  );
}
