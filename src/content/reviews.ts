// UniCleans riktiga Google-omdömen, hämtade från uniclean.nu.
// Texterna får inte ändras, förkortas eller kompletteras med påhittade omdömen.

export type Review = {
  name: string;
  time: string;
  text: string;
  /** Bakgrundsfärg på initialcirkeln. */
  color: string;
};

export const rating = "4,9";
export const count = 58;

export const reviews: Review[] = [
  {
    name: "Emelie Rüdén",
    time: "för 4 månader sedan",
    text: "Rekommenderas! Så nöjd! Många fönster med spröjs var inga problem. Ett fint jobb utfört av Martin. Snabb bokning till väldigt bra pris. Kommer anlitas igen.",
    color: "#7b1fa2",
  },
  {
    name: "Mohammad Alkalti",
    time: "för 2 månader sedan",
    text: "Bästa städfirman med de bästa personalen.",
    color: "#00796b",
  },
  {
    name: "Lyn Matthiessen Daniel",
    time: "för 5 månader sedan",
    text: "Kan varmt rekommendera för Fönsterputsning, noggranna och trevliga. Skinande rena fönster efter Lucas och Martin varit här!",
    color: "#c2185b",
  },
  {
    name: "Håkan Thoresson",
    time: "för 5 månader sedan",
    text: "Bra och snabb fönstertvätt till ett lågt pris. Jättebra! Vi kommer att bli återkommande kund. Håkan.",
    color: "#455a64",
  },
  {
    name: "Max Kinnunen",
    time: "för 8 månader sedan",
    text: "Jag hade nyligen nöjet att anlita bolaget och de förtjänar beröm för kundservicen och kvaliteten på utfört arbete.",
    color: "#e65100",
  },
  {
    name: "Fia Lindholm",
    time: "för 8 månader sedan",
    text: "Kan varmt rekommendera! De utförde ett riktigt bra jobb med våra fönster! Och så är de trevliga också! Tack!",
    color: "#1565c0",
  },
];
