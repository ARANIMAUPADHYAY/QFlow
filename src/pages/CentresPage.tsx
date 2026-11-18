import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { TextField } from "../components/ui/TextField";
import { EmptyState } from "../components/ui/Shared";
import { serviceCentres, centreWait } from "../services/mock/centres";
import { categoryLabels, categoryIcon, formatWait } from "../utils/format";
import type { ServiceCategory } from "../types/centre";

const categories: ServiceCategory[] = [
  "healthcare", "banking", "government", "salon", "education", "customer-service"
];

function statusTone(status: string): "sage" | "mustard" | "closed" {
  if (status === "open") return "sage";
  if (status === "busy") return "mustard";
  return "closed";
}

export function CentresPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState<ServiceCategory | "">(
    (params.get("category") as ServiceCategory) ?? "",
  );

  const filtered = useMemo(() => {
    return serviceCentres.filter((c) => {
      const matchCat = !category || c.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  function handleCategory(cat: ServiceCategory | "") {
    setCategory(cat);
    const next = new URLSearchParams(params);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setParams(next);
  }

  return (
    <Container className="py-10">
      <h1 className="font-display text-4xl text-ink">Service centres</h1>
      <p className="mt-2 text-ink-soft">Find a centre, check wait times, and join a queue.</p>

      {/* ── Filters ── */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextField
            label="Search"
            placeholder="Name, area or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleCategory("")}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${!category ? "bg-sage-deep text-paper" : "bg-card text-ink ring-1 ring-line hover:bg-cream"}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${category === cat ? "bg-sage-deep text-paper" : "bg-card text-ink ring-1 ring-line hover:bg-cream"}`}
          >
            {categoryIcon[cat]} {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No centres found"
          message="Try adjusting your search or category filter."
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((centre, i) => {
            const { queueLength, estimatedWaitMinutes } = centreWait(centre);
            const openServices = centre.services.filter((s) => s.status !== "closed");
            const busyCount = centre.services.filter((s) => s.status === "busy").length;
            const overallStatus = openServices.length === 0 ? "closed" : busyCount > 0 ? "busy" : "open";
            return (
              <motion.div
                key={centre.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/centres/${centre.id}`}
                  className="block rounded-3xl bg-card p-5 ring-1 ring-line/80 shadow-soft transition hover:ring-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl" aria-hidden>{categoryIcon[centre.category]}</span>
                    <Badge tone={statusTone(overallStatus)}>
                      {overallStatus === "open" ? "Open" : overallStatus === "busy" ? "Busy" : "Closed"}
                    </Badge>
                  </div>
                  <h2 className="mt-3 font-display text-xl text-ink">{centre.name}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{centre.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-olive">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} aria-hidden />
                      {centre.area}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} aria-hidden />
                      {centre.openHours}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <p className="text-sm text-ink-soft">
                      <span className="font-medium text-ink">{queueLength}</span> waiting
                    </p>
                    <p className="text-sm text-ink-soft">
                      Est. <span className="font-medium text-ink">{formatWait(estimatedWaitMinutes)}</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
