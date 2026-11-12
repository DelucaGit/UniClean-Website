export type Step = {
  title: string;
  text: string;
  image: string;
};

export const steps: readonly Step[] = [
  {
    title: "Välj städning",
    text: "Du ser tid och pris efter RUT direkt.",
    image: "/app/app-tjanst.jpg",
  },
  {
    title: "Välj dag och tid",
    text: "En gång eller återkommande, på exakt tid eller flexibelt.",
    image: "/app/app-tid.jpg",
  },
  {
    title: "En städare nära dig tar uppdraget",
    text: "Den som svarar först får det. Du ser namn och betyg.",
    image: "/app/app-soker.jpg",
  },
  {
    title: "Betala när du är nöjd",
    text: "Du får en notis när det är klart och betalar med Swish eller faktura.",
    image: "/app/app-betalning.jpg",
  },
];
