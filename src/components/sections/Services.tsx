import { sectionId } from "@/content/sections";
import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { Container } from "@/components/ui/Container";
import { services } from "@/content/services";

export function Services() {
  return (
    <section id={sectionId("tjanster")}>
      <Container>
        <h2>Tjänster</h2>
        <div className="mt-[30px] grid grid-cols-4 gap-[14px] max-[960px]:grid-cols-2 max-[560px]:grid-cols-1">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex min-h-[196px] flex-col rounded-r bg-soft p-[22px] max-[560px]:min-h-0"
            >
              <ServiceIcon id={service.id} className="mb-[18px]" />
              <h3>{service.name}</h3>
              <p className="mt-[4px] text-[15px] leading-[1.4]">{service.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
