import { Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { serviceCentres } from "../../services/mock/centres";

export function AdminServicesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Services</h1>
      <p className="mt-1 text-sm text-ink-soft">Configure available services per centre.</p>

      <div className="mt-6 space-y-8">
        {serviceCentres.map((centre) => (
          <div key={centre.id}>
            <h2 className="mb-3 font-display text-xl text-ink">{centre.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {centre.services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-3xl bg-card p-5 ring-1 ring-line shadow-soft"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-display text-lg text-ink">{service.name}</p>
                    <Badge
                      tone={
                        service.status === "open"
                          ? "sage"
                          : service.status === "busy"
                          ? "mustard"
                          : "closed"
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{service.description}</p>
                  <div className="mt-4 space-y-1.5 text-sm text-olive">
                    <div className="flex items-center gap-2">
                      <Clock size={13} aria-hidden />
                      {service.hours}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} aria-hidden />
                      {service.queueLength} waiting
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={13} aria-hidden />
                      ~{service.averageServiceMinutes} min avg
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled
                      title="Edit coming soon"
                      className="flex-1 rounded-full bg-cream py-2 text-xs font-medium text-ink-soft cursor-not-allowed opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled
                      title="Toggle coming soon"
                      className="flex-1 rounded-full bg-cream py-2 text-xs font-medium text-ink-soft cursor-not-allowed opacity-60"
                    >
                      {service.status === "closed" ? "Enable" : "Disable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
