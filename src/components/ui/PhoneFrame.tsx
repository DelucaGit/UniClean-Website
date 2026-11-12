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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full rounded-[24px]" />
    </div>
  );
}
