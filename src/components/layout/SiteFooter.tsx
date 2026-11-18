import { Logo } from "../brand/Logo";
import { Container } from "../ui/Container";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            A virtual queue for real service desks. Take a token, keep your place, and come in when it is your turn.
          </p>
        </div>
        <p className="text-sm text-olive">QFlow · Cedar Bay demo</p>
      </Container>
    </footer>
  );
}
