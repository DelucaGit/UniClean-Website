import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";
import { navLinks } from "@/content/nav";
import { MobileMenu } from "./MobileMenu";

const textLink =
  "rounded-full px-[12px] py-[8px] text-[15px] font-bold hover:bg-white/[.12]";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-dark text-white">
      <Container className="flex h-[64px] items-center gap-[34px]">
        <a href="#top" className="text-[26px] font-black tracking-[-.01em]">
          {site.name}
        </a>
        <nav className="flex gap-[6px] max-[960px]:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={textLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-[6px]">
          <a href={site.links.login} className={`${textLink} max-[960px]:hidden`}>
            Logga in
          </a>
          <Button href={site.links.app} variant="white" size="pill" track="boka-meny">
            Boka nu
          </Button>
          <MobileMenu links={navLinks} loginHref={site.links.login} />
        </div>
      </Container>
    </header>
  );
}
