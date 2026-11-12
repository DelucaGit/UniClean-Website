export type ServiceId = "hemstad" | "storstad" | "flyttstad" | "fonsterputs";

export type Service = {
  id: ServiceId;
  name: string;
  description: string;
};

export const services: readonly Service[] = [
  {
    id: "hemstad",
    name: "Hemstäd",
    description: "En gång eller återkommande. Pris efter m².",
  },
  {
    id: "storstad",
    name: "Storstäd",
    description: "Grundlig städning av hela hemmet. Pris efter m².",
  },
  {
    id: "flyttstad",
    name: "Flyttstäd",
    description: "Städning inför flytt. Pris efter m².",
  },
  {
    id: "fonsterputs",
    name: "Fönsterputs",
    description: "200 kr per fönster.",
  },
];
