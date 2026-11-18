import { Users, Clock, CheckCircle, Loader } from "lucide-react";
import { useQueue } from "../../context/QueueContext";
import { formatWait } from "../../utils/format";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-6 ring-1 ${highlight ? "bg-sage-deep text-paper ring-sage-deep" : "bg-card text-ink ring-line shadow-soft"}`}>
      <Icon size={22} className={highlight ? "text-sage/70" : "text-olive"} aria-hidden />
      <p className={`mt-4 font-display text-4xl ${highlight ? "text-paper" : "text-ink"}`}>{value}</p>
      <p className={`mt-1 text-sm ${highlight ? "text-sage/80" : "text-ink-soft"}`}>{label}</p>
      {sub && <p className={`mt-0.5 text-xs ${highlight ? "text-sage/60" : "text-olive"}`}>{sub}</p>}
    </div>
  );
}

export function AdminOverviewPage() {
  const { state } = useQueue();

  // Aggregate across all centres
  const allQueues = Object.values(state.queues);
  const allTokens = allQueues.flatMap((q) => q.tokens);

  const waiting = allTokens.filter((t) => t.status === "WAITING" || t.status === "APPROACHING").length;
  const serving = allTokens.filter((t) => t.status === "SERVING" || t.status === "CALLED").length;
  const completed = Object.values(state.allTokens).filter((t) => t.status === "COMPLETED").length;
  const totalToday = allTokens.length + completed;

  const waitingTokens = allTokens.filter((t) => t.status === "WAITING" || t.status === "APPROACHING");
  const avgWait =
    waitingTokens.length > 0
      ? Math.round(waitingTokens.reduce((s, t) => s + t.estimatedWaitMinutes, 0) / waitingTokens.length)
      : 0;

  const allCounters = allQueues.flatMap((q) => q.counters);
  const activeCounters = allCounters.filter((c) => c.status === "ACTIVE").length;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink-soft">Live snapshot across all service centres.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total today" value={totalToday} />
        <StatCard icon={Loader} label="Currently waiting" value={waiting} highlight />
        <StatCard icon={CheckCircle} label="Serving now" value={serving} />
        <StatCard icon={CheckCircle} label="Completed" value={completed} />
        <StatCard icon={Clock} label="Avg. wait" value={formatWait(avgWait)} sub="Across active queues" />
        <StatCard icon={Users} label="Active counters" value={`${activeCounters} / ${allCounters.length}`} />
      </div>

      {/* Per-centre summary */}
      <h2 className="mt-10 font-display text-xl text-ink">Centre summary</h2>
      <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-line">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs font-medium text-olive">
            <tr>
              <th className="px-4 py-3">Centre</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Waiting</th>
              <th className="px-4 py-3">Serving</th>
              <th className="px-4 py-3">Counters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {allQueues.map((q) => {
              const w = q.tokens.filter((t) => t.status === "WAITING" || t.status === "APPROACHING").length;
              const s = q.tokens.filter((t) => t.status === "SERVING" || t.status === "CALLED").length;
              const ac = q.counters.filter((c) => c.status === "ACTIVE").length;
              return (
                <tr key={q.centreId} className="bg-card">
                  <td className="px-4 py-3 font-medium text-ink capitalize">
                    {q.centreId.replace(/-/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      q.status === "OPEN" ? "bg-sage/50 text-ink" : q.status === "PAUSED" ? "bg-mustard/50 text-ink" : "bg-line text-ink-soft"
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{w}</td>
                  <td className="px-4 py-3 text-ink">{s}</td>
                  <td className="px-4 py-3 text-ink">{ac} / {q.counters.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
