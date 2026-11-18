import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonLink } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/Shared";
import { categoryIcon, categoryLabels } from "../utils/format";
import type { ServiceCategory } from "../types/centre";
import room from "../assets/waiting-room-reference.png";

const categories: ServiceCategory[] = [
  "healthcare", "banking", "government", "salon", "education", "customer-service"
];

const steps = [
  { icon: "🔍", title: "Find your centre", body: "Search by name, area or category. See real-time queue lengths and estimated wait times." },
  { icon: "🎫", title: "Take a token", body: "Select your service, enter your name, and receive a unique digital token number instantly." },
  { icon: "📱", title: "Wait anywhere", body: "Track your position in real time. Watch the animated waiting room as the queue moves forward." },
  { icon: "🔔", title: "Show up when called", body: "Get notified when you're next. Walk in at the right moment — no earlier, no later." },
];

const benefits = [
  { Icon: Clock, title: "Real-time estimates", body: "Wait times are calculated from live queue data, not guesswork." },
  { Icon: Users, title: "Guest-friendly", body: "No account required. Join a queue with just your name." },
  { Icon: Zap, title: "Instant updates", body: "Queue changes reflect immediately across all devices." },
];

function fade(delay = 0) {
  return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: "easeOut" } };
}

export function LandingPage() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b border-line bg-paper">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <motion.div {...(reduce ? {} : fade(0))}>
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
                <ArrowRight aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink to="#how-it-works" variant="secondary">
                How it works
              </ButtonLink>
            </div>
          </motion.div>
          <motion.figure className="relative" {...(reduce ? {} : fade(0.08))}>
            <img
              src={room}
              alt="Isometric illustration of a sunlit waiting room with mustard sofas, plants, and people sitting."
              className="w-full rounded-[2rem] shadow-soft ring-1 ring-line"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card/95 px-4 py-3 shadow-soft ring-1 ring-line sm:right-auto sm:max-w-xs">
              <p className="text-xs font-medium tracking-wide text-olive">Live in the room</p>
              <p className="mt-1 font-display text-2xl text-ink">Token Q002</p>
              <p className="text-sm text-ink-soft">1 person ahead · about 12 minutes</p>
            </figcaption>
          </motion.figure>
        </Container>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20">
        <Container>
          <SectionHeading label="Simple by design" title="Four steps to a calmer visit" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="rounded-3xl bg-card p-6 ring-1 ring-line/80"
                {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.08 } })}
              >
                <span className="text-3xl" aria-hidden>{s.icon}</span>
                <p className="mt-4 font-display text-lg text-ink">{s.title}</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Categories ── */}
      <section className="border-t border-line bg-cream/40 py-16">
        <Container>
          <SectionHeading label="Where QFlow works" title="Every kind of queue" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/centres?category=${cat}`}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card p-5 text-center ring-1 ring-line/80 transition hover:ring-sage-deep hover:shadow-soft"
              >
                <span className="text-3xl" aria-hidden>{categoryIcon[cat]}</span>
                <span className="text-sm font-medium text-ink">{categoryLabels[cat]}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20">
        <Container>
          <SectionHeading label="Why QFlow" title="Designed around the person waiting" />
          <div className="grid gap-6 sm:grid-cols-3">
            {benefits.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-3xl bg-card p-6 ring-1 ring-line/80">
                <Icon size={24} className="text-sage-deep" aria-hidden />
                <p className="mt-4 font-display text-lg text-ink">{title}</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-line bg-sage-deep py-20 text-paper">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl">Ready to skip the wait?</h2>
          <p className="max-w-md text-sage/90">
            Find a service centre near you and take a token right now. No sign-in required.
          </p>
          <ButtonLink to="/centres" variant="secondary">
            Find a centre
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
