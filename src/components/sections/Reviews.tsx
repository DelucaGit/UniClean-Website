import { sectionId } from "@/content/sections";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { count, rating, reviews } from "@/content/reviews";

function Stars({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="text-[17px] leading-none tracking-[2px] text-star">
      ★★★★★
    </div>
  );
}

export function Reviews() {
  return (
    <section id={sectionId("omdomen")}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-[24px]">
          <div>
            <h2>Vad kunderna säger</h2>
            <div className="mt-[14px] flex items-center gap-[14px]">
              <GoogleLogo className="h-[34px] w-[34px] flex-none" />
              <b className="text-[44px] leading-none font-black">{rating}</b>
              <div>
                <Stars label={`${rating} av 5`} />
                <small className="block text-[14.5px] font-semibold text-mute">
                  {count} omdömen på Google
                </small>
              </div>
            </div>
          </div>
          <TextLink href={site.links.googleReviews}>Läs alla omdömen på Google</TextLink>
        </div>
        <div className="mt-[32px] columns-3 gap-[16px] max-[960px]:columns-2 max-[560px]:columns-1">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="mb-[16px] break-inside-avoid rounded-r border border-line p-[20px]"
            >
              <div className="mb-[12px] flex items-center gap-[12px]">
                <span
                  aria-hidden="true"
                  className="grid h-[40px] w-[40px] flex-none place-items-center rounded-full text-[18px] font-bold text-white"
                  style={{ background: review.color }}
                >
                  {review.name.charAt(0)}
                </span>
                <b className="text-[15.5px] leading-[1.25]">{review.name}</b>
                <GoogleLogo className="ml-auto h-[20px] w-[20px] flex-none" />
              </div>
              <Stars label="5 av 5" />
              <p className="mt-[10px] text-[15.5px] text-ink">{review.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
