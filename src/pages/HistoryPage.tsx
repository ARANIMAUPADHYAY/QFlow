import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/Shared";
import { ButtonLink } from "../components/ui/Button";
import { useQueue } from "../context/QueueContext";
import { getCentre } from "../services/mock/centres";
import { formatDate, formatWait, tokenStatusLabel, tokenStatusTone } from "../utils/format";
import type { TokenStatus } from "../types/queue";

export function HistoryPage() {
  const { state } = useQueue();

  const myTokens = state.myTokenIds
    .map((id) => state.allTokens[id])
    .filter(Boolean)
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  if (myTokens.length === 0) {
    return (
      <Container className="py-20">
        <EmptyState
          icon="📋"
          title="No queue history yet"
          message="Tokens you join will appear here so you can track past visits."
          action={<ButtonLink to="/centres">Find a centre</ButtonLink>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl text-ink">Queue history</h1>
      <p className="mt-1 text-sm text-ink-soft">Your past and active queue entries.</p>

      <div className="mt-6 space-y-3">
        {myTokens.map((token) => {
          const centre = getCentre(token.centreId);
          const service = centre?.services.find((s) => s.id === token.serviceId);
          const isActive = !["COMPLETED", "CANCELLED", "SKIPPED", "NO_SHOW"].includes(token.status);
          return (
            <Link
              key={token.id}
              to={`/token/${token.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl bg-card p-4 ring-1 ring-line shadow-soft transition hover:ring-sage-deep"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-ink">{token.tokenNumber}</span>
                  <Badge tone={tokenStatusTone[token.status as TokenStatus]}>
                    {tokenStatusLabel[token.status as TokenStatus]}
                  </Badge>
                  {isActive && (
                    <span className="rounded-full bg-mustard/20 px-2 py-0.5 text-xs font-medium text-ink">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-soft">
                  {service?.name ?? token.serviceId} · {centre?.name ?? token.centreId}
                </p>
                <p className="mt-0.5 text-xs text-olive">{formatDate(token.joinedAt)}</p>
              </div>
              <div className="shrink-0 text-right">
                {isActive ? (
                  <p className="text-sm text-sage-deep font-medium">
                    {token.position > 1 ? `${token.position - 1} ahead` : "Next!"}
                  </p>
                ) : (
                  <p className="text-xs text-olive">
                    {token.completedAt ? formatDate(token.completedAt) : "—"}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
