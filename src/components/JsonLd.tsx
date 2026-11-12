import { isPlaceholder, site } from "@/config/site";
import { count, rating } from "@/content/reviews";

/** Strukturerad data (schema.org) om företaget och dess Google-betyg. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: `${site.url}/`,
    image: `${site.url}/og.jpg`,
    email: site.contact.email,
    // Telefonnumret tas bara med när det riktiga numret är inlagt.
    ...(isPlaceholder(site.contact.phoneHref)
      ? {}
      : { telephone: site.contact.phoneHref.replace(/^tel:/, "") }),
    aggregateRating: {
      "@type": "AggregateRating",
      // JSON-LD kräver punkt som decimaltecken.
      ratingValue: rating.replace(",", "."),
      bestRating: "5",
      reviewCount: count,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
