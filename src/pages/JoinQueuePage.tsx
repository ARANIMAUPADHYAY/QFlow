import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button, ButtonLink } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { EmptyState } from "../components/ui/Shared";
import { getCentre } from "../services/mock/centres";
import { useQueue } from "../context/QueueContext";
import { useToast } from "../context/ToastContext";
import { formatWait } from "../utils/format";
import type { QueueToken } from "../types/queue";

type Step = "details" | "confirm" | "done";

export function JoinQueuePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { joinQueue, getQueueForCentre } = useQueue();
  const toast = useToast();

  const centre = id ? getCentre(id) : undefined;
  const preselectedService = searchParams.get("service") ?? "";
  const service = centre?.services.find((s) => s.id === preselectedService);
  const queue = id ? getQueueForCentre(id) : undefined;

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isGuest] = useState(true);
  const [token, setToken] = useState<QueueToken | null>(null);

  if (!centre || !service) {
    return (
      <Container className="py-20">
        <EmptyState
          icon="🎫"
          title="Service not found"
          message="The selected service is not available."
          action={<ButtonLink to="/centres" variant="secondary">Back to centres</ButtonLink>}
        />
      </Container>
    );
  }

  if (queue?.status === "CLOSED") {
    return (
      <Container className="py-20">
        <EmptyState
          icon="🔒"
          title="Queue is closed"
          message="This queue is not accepting new entries right now."
          action={<ButtonLink to={`/centres/${centre.id}`} variant="secondary">Back to centre</ButtonLink>}
        />
      </Container>
    );
  }

  function handleConfirm() {
    if (!name.trim()) {
      toast.warning("Please enter your name");
      return;
    }
    setStep("confirm");
  }

  function handleJoin() {
    const newToken = joinQueue({
      centreId: centre!.id,
      serviceId: service!.id,
      customerName: name.trim() || "Guest",
      customerPhone: phone.trim() || undefined,
      isGuest,
    });
    setToken(newToken);
    setStep("done");
    toast.success("You joined the queue!", `Token ${newToken.tokenNumber} issued.`);
  }

  return (
    <Container className="max-w-lg py-10">
      <Link to={`/centres/${centre.id}`} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={15} aria-hidden /> {centre.name}
      </Link>

      <h1 className="mt-5 font-display text-3xl text-ink">Join queue</h1>
      <p className="mt-1 text-ink-soft">
        {service.name} · {centre.name}
      </p>

      <div className="mt-2 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
        <span className="font-medium text-ink">{service.queueLength} people</span> waiting ·{" "}
        Est. <span className="font-medium text-ink">{formatWait(service.averageServiceMinutes * (service.queueLength + 1))}</span> wait
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Details */}
        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-8 space-y-4"
          >
            <TextField
              label="Your name"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <TextField
              label="Phone (optional)"
              placeholder="+1 555 000 0000"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-olive">
              No account needed. Your details are only used to identify your token.
            </p>
            <div className="flex justify-end pt-2">
              <Button onClick={handleConfirm} disabled={!name.trim()}>
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Confirm */}
        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-8"
          >
            <div className="rounded-3xl bg-card p-6 ring-1 ring-line shadow-soft">
              <p className="text-xs font-medium tracking-wide text-olive">Confirm your details</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Name</span>
                  <span className="font-medium text-ink">{name}</span>
                </div>
                {phone && (
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Phone</span>
                    <span className="font-medium text-ink">{phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-soft">Service</span>
                  <span className="font-medium text-ink">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Centre</span>
                  <span className="font-medium text-ink">{centre.name}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-between">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-sm text-ink-soft hover:text-ink"
              >
                ← Edit
              </button>
              <Button onClick={handleJoin}>Confirm & get token</Button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Done */}
        {step === "done" && token && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
              <CheckCircle size={32} className="text-sage-deep" aria-hidden />
            </div>
            <h2 className="mt-4 font-display text-2xl text-ink">You're in!</h2>
            <p className="mt-2 text-ink-soft">Your token has been issued.</p>
            <div className="mx-auto mt-6 max-w-xs rounded-3xl bg-sage-deep p-8 text-paper shadow-soft">
              <p className="text-xs font-medium tracking-widest opacity-70">{service.name.toUpperCase()}</p>
              <p className="mt-2 font-display text-6xl">{token.tokenNumber}</p>
              <p className="mt-3 text-sm opacity-80">{service.queueLength} people ahead</p>
              <p className="mt-1 text-sm opacity-80">Est. {formatWait(token.estimatedWaitMinutes)}</p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate(`/token/${token.id}`)}>
                Track my token
              </Button>
              <ButtonLink to={`/centres/${centre.id}`} variant="secondary">
                Back to centre
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
