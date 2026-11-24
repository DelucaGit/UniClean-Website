// UniCleans riktiga Google-omdömen, hämtade från uniclean.nu.
// Texterna får inte ändras, förkortas eller kompletteras med påhittade omdömen.

export type Review = {
  name: string;
  text: string;
  /** Bakgrundsfärg på initialcirkeln. */
  color: string;
};

export const rating = "4,8";
export const count = 65;

export const reviews: Review[] = [
  {
    name: "Emelie Rüdén",
    text: "Rekommenderas! Så nöjd! Många fönster med spröjs var inga problem. Ett fint jobb utfört av Martin. Snabb bokning till väldigt bra pris. Kommer anlitas igen.",
    color: "#7b1fa2",
  },
  {
    name: "Mohammad Alkalti",
    text: "Bästa städfirman med de bästa personalen.",
    color: "#00796b",
  },
  {
    name: "Lyn Matthiessen Daniel",
    text: "Kan varmt rekommendera för Fönsterputsning, noggranna och trevliga. Skinande rena fönster efter Lucas och Martin varit här!",
    color: "#c2185b",
  },
  {
    name: "Håkan Thoresson",
    text: "Bra och snabb fönstertvätt till ett lågt pris. Jättebra! Vi kommer att bli återkommande kund. Håkan.",
    color: "#455a64",
  },
  {
    name: "Max Kinnunen",
    text: "Jag hade nyligen nöjet att anlita bolaget och de förtjänar beröm för kundservicen och kvaliteten på utfört arbete.",
    color: "#e65100",
  },
  {
    name: "Fia Lindholm",
    text: "Kan varmt rekommendera! De utförde ett riktigt bra jobb med våra fönster! Och så är de trevliga också! Tack!",
    color: "#1565c0",
  },
];
