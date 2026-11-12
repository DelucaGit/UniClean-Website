import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** Bildens visade bredd. Skärmbilderna är 600 x 1211 px. */
  sizes?: string;
};

export function PhoneFrame({ src, alt, className = "", sizes = "236px" }: PhoneFrameProps) {
  return (
    <div
      className={`rounded-[30px] bg-[#0c1620] p-[7px] shadow-[0_24px_60px_rgba(8,20,35,.35)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={600}
        height={1211}
        sizes={sizes}
        className="block h-auto w-full rounded-[24px]"
      />
    </div>
  );
}
