import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-[1200px] px-[32px] max-[960px]:px-[20px] ${className}`}>
      {children}
    </div>
  );
}
