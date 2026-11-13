import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
};

export function PhoneFrame({ src, alt, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`rounded-[30px] bg-[#0c1620] p-[7px] shadow-[0_24px_60px_rgba(8,20,35,.35)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={600}
        height={1211}
        // Ingen sizes: då skickas alltid hela 600 px-bilden. Mindre varianter
        // och lägre kvalitet gör texten i skärmbilderna suddig.
        quality={90}
        className="block h-auto w-full rounded-[24px]"
      />
    </div>
  );
}
