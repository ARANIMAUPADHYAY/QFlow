import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
import { ButtonLink } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-8xl text-line">404</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Page not found</h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/">
          <Home size={16} aria-hidden /> Go home
        </ButtonLink>
        <ButtonLink to="/centres" variant="secondary">
          <ArrowLeft size={16} aria-hidden /> Browse centres
        </ButtonLink>
      </div>
    </Container>
  );
}
