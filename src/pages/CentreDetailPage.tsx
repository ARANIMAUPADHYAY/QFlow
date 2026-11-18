import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { Button, ButtonLink } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/Shared";
import { getCentre } from "../services/mock/centres";
import { useQueue } from "../context/QueueContext";
import { categoryIcon, formatWait, serviceStatusLabel } from "../utils/format";
import type { ServiceOffering } from "../types/centre";

function serviceTone(s: ServiceOffering): "sage" | "mustard" | "closed" {
  if (s.status === "open") return "sage";
  if (s.status === "busy") return "mustard";
  return "closed";
}

export function CentreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQueueForCentre, getActiveTokenForCentre } = useQueue();
  const centre = id ? getCentre(id) : undefined;
  const [selected, setSelected] = useState<string | null>(null);

  if (!centre) {
    return (
      <Container className="py-20">
        <EmptyState icon="🏛️" title="Centre not found" message="This service centre doesn't exist or has been removed." action={<ButtonLink to="/centres" variant="secondary">Back to centres</ButtonLink>} />
      </Container>
    );
  }

  const queue = getQueueForCentre(centre.id);
  const myToken = getActiveTokenForCentre(centre.id);
  const queueCounters = queue?.counters ?? [];
  const activeCounters = queueCounters.filter((c) => c.status === "ACTIVE").length;

  function handleJoin() {
    if (!selected) return;
    navigate(`/centres/${centre!.id}/join?service=${selected}`);
  }

  return (
    <Container className="py-10">
      <Link to="/centres" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={15} aria-hidden /> Back to centres
      </Link>

      {/* ── Header ── */}
      <div className="mt-5 flex items-start gap-4">
        <span className="text-4xl" aria-hidden>{categoryIcon[centre.category]}</span>
        <div>
          <h1 className="font-display text-3xl text-ink">{centre.name}</h1>
          <p className="mt-1 text-ink-soft">{centre.summary}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-olive">
            <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden />{centre.address}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden />{centre.openHours}</span>
            <span className="flex items-center gap-1.5"><Users size={14} aria-hidden />{activeCounters} of {queueCounters.length} counters active</span>
          </div>
        </div>
      </div>

      {/* ── My active token ── */}
      {myToken && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-sage/20 px-5 py-4 ring-1 ring-sage"
        >
          <p className="text-sm font-medium text-sage-deep">You're in this queue</p>
          <p className="mt-1 text-ink">
            Token <span className="font-display text-xl">{myToken.tokenNumber}</span> ·{" "}
            {myToken.position - 1 > 0 ? `${myToken.position - 1} ahead` : "you're next!"} ·{" "}
            {formatWait(myToken.estimatedWaitMinutes)}
          </p>
          <Link
            to={`/token/${myToken.id}`}
            className="mt-2 inline-flex text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
          >
            Track my token →
          </Link>
        </motion.div>
      )}

      {/* ── Queue status ── */}
      {queue && (
        <div className="mt-3">
          {queue.status === "PAUSED" && (
            <div className="rounded-2xl bg-mustard/20 px-4 py-3 text-sm text-ink ring-1 ring-mustard">
              ⏸ Queue is paused{queue.pauseReason ? ` — ${queue.pauseReason}` : ""}
            </div>
          )}
          {queue.status === "CLOSED" && (
            <div className="rounded-2xl bg-line px-4 py-3 text-sm text-ink-soft ring-1 ring-line">
              🔒 Queue is closed for today.
            </div>
          )}
        </div>
      )}

      {/* ── Services ── */}
      <h2 className="mt-10 font-display text-2xl text-ink">Available services</h2>
      <p className="mt-1 text-sm text-ink-soft">Select a service to join its queue.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {centre.services.map((service) => {
          const isSelected = selected === service.id;
          const disabled = service.status === "closed" || queue?.status === "CLOSED";
          return (
            <button
              key={service.id}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setSelected(isSelected ? null : service.id)}
              className={`rounded-3xl p-5 text-left ring-2 transition ${
                isSelected
                  ? "bg-sage/10 ring-sage-deep shadow-soft"
                  : disabled
                  ? "bg-line/40 ring-transparent opacity-60 cursor-not-allowed"
                  : "bg-card ring-line hover:ring-sage/60 shadow-soft"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-lg text-ink">{service.name}</p>
                <Badge tone={serviceTone(service)}>{serviceStatusLabel[service.status]}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{service.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="text-olive">{service.hours}</span>
                <span className="text-ink-soft">
                  ~{service.averageServiceMinutes} min avg
                </span>
                <span className="font-medium text-ink">{service.queueLength} waiting</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Action ── */}
      {!myToken && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleJoin}
            disabled={!selected || queue?.status === "CLOSED"}
          >
            Join queue
          </Button>
        </div>
      )}
    </Container>
  );
}
