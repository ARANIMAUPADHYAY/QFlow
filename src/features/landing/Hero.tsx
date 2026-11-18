import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import room from "../../assets/waiting-room-reference.png";
import { ButtonLink } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <p className="text-sm font-medium tracking-wide text-olive">Virtual queues for real desks</p>
        <h1 className="mt-3 max-w-xl font-display text-5xl leading-[1.05] font-medium tracking-tight text-ink sm:text-6xl">
          Make waiting feel less like waiting.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-ink-soft">
          Join a clinic, bank, or service desk from wherever you are. Hold a token, see how many people are ahead, and wait in a sunlit room instead of a corridor.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/centres">
            Join a queue
            <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink to="/#how-it-works" variant="secondary">
            Explore how it works
          </ButtonLink>
        </div>
      </motion.div>

      <motion.figure
        className="relative"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
      >
        <img
          src={room}
          alt="Isometric illustration of a sunlit waiting room with mustard sofas, plants, and people sitting and talking."
          className="w-full rounded-[2rem] shadow-soft ring-1 ring-line"
        />
        <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card/95 px-4 py-3 shadow-soft ring-1 ring-line sm:right-auto sm:max-w-xs">
          <p className="text-xs font-medium tracking-wide text-olive">Now in the room</p>
          <p className="mt-1 font-display text-2xl text-ink">Token Q014</p>
          <p className="text-sm text-ink-soft">3 people ahead · about 18 minutes</p>
        </figcaption>
      </motion.figure>
    </Container>
  );
}
