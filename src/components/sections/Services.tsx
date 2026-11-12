import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { Container } from "@/components/ui/Container";
import { bookingUrl } from "@/config/site";
import { services } from "@/content/services";

export function Services() {
  return (
    <section id="tjanster" className="pt-0">
      <Container>
        <h2>Tjänster</h2>
        <div className="mt-[30px] grid grid-cols-4 gap-[14px] max-[960px]:grid-cols-2 max-[560px]:grid-cols-1">
          {services.map((service) => (
            <a
              key={service.id}
              href={bookingUrl({ service: service.id })}
              data-track={`boka-tjanst-${service.id}`}
              className="flex min-h-[196px] flex-col rounded-r bg-soft p-[22px] transition-colors duration-150 hover:bg-[#e9eef5] max-[560px]:min-h-0"
            >
              <ServiceIcon id={service.id} className="mb-[18px]" />
              <h3>{service.name}</h3>
              <p className="mt-[4px] mb-[16px] text-[15px] leading-[1.4]">
                {service.description}
              </p>
              <span className="mt-auto inline-flex items-center justify-center self-start rounded-full bg-white px-[16px] py-[9px] text-[14.5px] font-extrabold whitespace-nowrap text-ink">
                Boka
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
