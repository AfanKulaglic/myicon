import { useEffect, useMemo, useState } from "react";
import {
  subscribeToChatLogs,
  subscribeToPageViews,
  type ChatLogEntry,
  type PageViewEntry,
} from "@/lib/firestore";
import {
  MessageSquare,
  Eye,
  Globe,
  MonitorSmartphone,
  TrendingUp,
  BarChart3,
  Smartphone,
  Tablet,
  Monitor,
  Clock,
  Bot,
} from "lucide-react";

type Period = "day" | "week" | "month";
type Range = "7d" | "30d" | "90d" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Tag",
  week: "Woche",
  month: "Monat",
};

const RANGE_LABELS: Record<Range, string> = {
  "7d": "Letzte 7 Tage",
  "30d": "Letzte 30 Tage",
  "90d": "Letzte 90 Tage",
  all: "Gesamte Zeit",
};

/** Bucket a timestamp into a day/week/month key. */
function bucketKey(ts: number, period: Period): string {
  const d = new Date(ts);
  if (period === "day") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  if (period === "week") {
    // ISO week number
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const week = Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    return `KW ${week} ${date.getUTCFullYear()}`;
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Fill in missing buckets between the oldest and newest timestamps. */
function fillBuckets(
  counts: Map<string, number>,
  period: Period,
): { key: string; count: number }[] {
  if (counts.size === 0) return [];
  const keys = [...counts.keys()];
  const sorted = keys.sort();
  const first = new Date(sorted[0]);
  const last = new Date(sorted[sorted.length - 1]);
  const out: { key: string; count: number }[] = [];
  const cur = new Date(first);

  const advance = (d: Date) => {
    if (period === "day") d.setDate(d.getDate() + 1);
    else if (period === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
  };

  let guard = 0;
  while (cur <= last && guard < 1000) {
    guard++;
    const key = bucketKey(cur.getTime(), period);
    out.push({ key, count: counts.get(key) ?? 0 });
    advance(cur);
  }
  return out;
}

const DEVICE_ICONS = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

function BarChart({ data }: { data: { key: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-1.5 h-40 mt-4">
      {data.map((d) => (
        <div key={d.key} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <span className="text-[10px] text-ink-muted tabular-nums">
            {d.count > 0 ? d.count : ""}
          </span>
          <div
            className="w-full bg-brand/70 hover:bg-brand rounded-t transition-all min-h-[2px]"
            style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
            title={`${d.key}: ${d.count}`}
          />
          <span className="text-[9px] text-ink-subtle truncate w-full text-center">
            {d.key}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [chatLogs, setChatLogs] = useState<ChatLogEntry[]>([]);
  const [pageViews, setPageViews] = useState<PageViewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [chatRange, setChatRange] = useState<Range>("7d");
  const [viewRange, setViewRange] = useState<Range>("7d");
  const [viewPeriod, setViewPeriod] = useState<Period>("day");
  const [expandedChat, setExpandedChat] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubLogs = subscribeToChatLogs(setChatLogs);
    const unsubViews = subscribeToPageViews(setPageViews);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => {
      unsubLogs();
      unsubViews();
      clearTimeout(timer);
    };
  }, []);

  const toggleChat = (id: string) =>
    setExpandedChat((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const rangeCutoff = (range: Range): number =>
    range === "all" ? 0 : Date.now() - (range === "7d" ? 7 : range === "30d" ? 30 : 90) * 86400000;

  // ── Chat log analytics ─────────────────────────────────────────────────────
  const chatFiltered = useMemo(
    () => chatLogs.filter((c) => c.ts >= rangeCutoff(chatRange)),
    [chatLogs, chatRange],
  );

  const chatByPeriod = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of chatFiltered) {
      const key = bucketKey(c.ts, "day");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return fillBuckets(counts, "day").slice(-14);
  }, [chatFiltered]);

  const chatCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of chatFiltered) {
      const cc = (c.country || "??").toUpperCase();
      counts.set(cc, (counts.get(cc) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [chatFiltered]);

  const chatDevices = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of chatFiltered) {
      counts.set(c.device || "?", (counts.get(c.device || "?") ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [chatFiltered]);

  // ── Page view analytics ────────────────────────────────────────────────────
  const viewsFiltered = useMemo(
    () => pageViews.filter((v) => v.ts >= rangeCutoff(viewRange)),
    [pageViews, viewRange],
  );

  const viewsByPeriod = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of viewsFiltered) {
      const key = bucketKey(v.ts, viewPeriod);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const filled = fillBuckets(counts, viewPeriod);
    return viewPeriod === "day" ? filled.slice(-14) : filled.slice(-12);
  }, [viewsFiltered, viewPeriod]);

  const uniqueSessions = useMemo(
    () => new Set(viewsFiltered.map((v) => v.sessionId).filter(Boolean)).size,
    [viewsFiltered],
  );

  const avgViewsPerSession = useMemo(() => {
    const perSession = new Map<string, number>();
    for (const v of viewsFiltered) {
      if (!v.sessionId) continue;
      perSession.set(v.sessionId, (perSession.get(v.sessionId) ?? 0) + 1);
    }
    if (perSession.size === 0) return 0;
    return [...perSession.values()].reduce((a, b) => a + b, 0) / perSession.size;
  }, [viewsFiltered]);

  const topPages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of viewsFiltered) {
      counts.set(v.path || "/", (counts.get(v.path || "/") ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [viewsFiltered]);

  const viewCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of viewsFiltered) {
      const cc = (v.country || "??").toUpperCase();
      counts.set(cc, (counts.get(cc) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [viewsFiltered]);

  const viewDevices = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of viewsFiltered) {
      counts.set(v.device || "?", (counts.get(v.device || "?") ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [viewsFiltered]);

  const totalChats = chatFiltered.length;
  const totalViews = viewsFiltered.length;

  const deviceTotal = viewDevices.reduce((s, [, n]) => s + n, 0);
  const countryTotal = viewCountries.reduce((s, [, n]) => s + n, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analytik & Statistiken</h1>
        <p className="text-sm text-ink-muted mt-1">
          Chat-Verläufe des AI-Assistenten und Besucher-Analysen der Website.
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-ink-muted text-sm">Lädt…</div>
      ) : (
        <>
          {/* ═══ AI CHAT LOGS ═══ */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="size-5 text-brand" /> AI-Chat-Verläufe
              </h2>
              <div className="flex gap-1.5">
                {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChatRange(r)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                      chatRange === r
                        ? "bg-brand text-white border-brand"
                        : "bg-white border-line text-ink-muted hover:border-brand/40"
                    }`}
                  >
                    {RANGE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card p-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-brand/10 text-brand"><MessageSquare className="size-5" /></span>
                <div>
                  <p className="text-xs text-ink-muted">Chat-Nachrichten</p>
                  <p className="text-xl font-semibold">{totalChats}</p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-700"><Globe className="size-5" /></span>
                <div>
                  <p className="text-xs text-ink-muted">Länder</p>
                  <p className="text-xl font-semibold">{chatCountries.length}</p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-purple-100 text-purple-700"><MonitorSmartphone className="size-5" /></span>
                <div>
                  <p className="text-xs text-ink-muted">Geräte-Typen</p>
                  <p className="text-xl font-semibold">{chatDevices.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-sm font-medium mb-2">Chats pro Tag (letzte 14)</p>
              <BarChart data={chatByPeriod} />
            </div>

            {/* Chat log table */}
            <div className="card overflow-hidden">
              {chatFiltered.length === 0 ? (
                <div className="p-8 text-center text-ink-muted text-sm">
                  Noch keine Chat-Nachrichten in diesem Zeitraum.
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {chatFiltered.map((c) => {
                    const open = expandedChat.has(c.id);
                    const DeviceIcon = DEVICE_ICONS[c.device as keyof typeof DEVICE_ICONS] ?? Monitor;
                    return (
                      <div key={c.id} className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleChat(c.id)}
                          className="w-full text-left flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{c.question}</p>
                            <p className="text-xs text-ink-muted mt-1 line-clamp-2">{c.reply}</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-ink-muted shrink-0">
                            <span className="px-1.5 py-0.5 rounded bg-surface-alt font-medium uppercase">
                              {c.country || "??"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <DeviceIcon className="size-3" />
                              {c.device ?? "?"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="size-3" />
                              {new Date(c.ts).toLocaleString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </button>
                        {open && (
                          <div className="mt-3 space-y-2">
                            <div className="rounded-lg bg-brand/5 border border-brand/15 p-3">
                              <p className="text-[10px] uppercase tracking-wide text-ink-muted font-medium mb-1">
                                Frage
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{c.question}</p>
                            </div>
                            <div className="rounded-lg bg-white border border-line p-3">
                              <p className="text-[10px] uppercase tracking-wide text-ink-muted font-medium mb-1">
                                Antwort {c.model ? `· ${c.model}` : ""}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{c.reply}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ═══ PAGE VIEWS ═══ */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Eye className="size-5 text-brand" /> Seitenaufrufe
              </h2>
              <div className="flex flex-wrap gap-1.5">
                <div className="flex gap-1.5 mr-2">
                  {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setViewRange(r)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        viewRange === r
                          ? "bg-brand text-white border-brand"
                          : "bg-white border-line text-ink-muted hover:border-brand/40"
                      }`}
                    >
                      {RANGE_LABELS[r]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setViewPeriod(p)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        viewPeriod === p
                          ? "bg-ink text-white border-ink"
                          : "bg-white border-line text-ink-muted hover:border-ink/40"
                      }`}
                    >
                      {PERIOD_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* View stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="card p-4">
                <div className="flex items-center gap-2 text-brand"><BarChart3 className="size-4" /></div>
                <p className="text-xs text-ink-muted mt-2">Seitenaufrufe</p>
                <p className="text-xl font-semibold">{totalViews}</p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-blue-600"><TrendingUp className="size-4" /></div>
                <p className="text-xs text-ink-muted mt-2">Einzigartige Besuche</p>
                <p className="text-xl font-semibold">{uniqueSessions}</p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-green-600"><Eye className="size-4" /></div>
                <p className="text-xs text-ink-muted mt-2">Seiten pro Besuch</p>
                <p className="text-xl font-semibold">{avgViewsPerSession.toFixed(1)}</p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 text-purple-600"><Bot className="size-4" /></div>
                <p className="text-xs text-ink-muted mt-2">AI-Chats</p>
                <p className="text-xl font-semibold">{totalChats}</p>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-sm font-medium mb-2">
                Aufrufe pro {PERIOD_LABELS[viewPeriod].toLowerCase()}
              </p>
              <BarChart data={viewsByPeriod} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Top pages */}
              <div className="card p-5">
                <p className="text-sm font-medium mb-3">Beliebteste Seiten</p>
                <div className="space-y-2">
                  {topPages.map(([path, n], i) => (
                    <div key={path} className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-ink-muted truncate">
                        {i + 1}. {path}
                      </span>
                      <span className="text-xs font-semibold tabular-nums">{n}</span>
                    </div>
                  ))}
                  {topPages.length === 0 && (
                    <p className="text-xs text-ink-muted">Keine Daten</p>
                  )}
                </div>
              </div>

              {/* Countries */}
              <div className="card p-5">
                <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                  <Globe className="size-4 text-brand" /> Länder
                </p>
                <div className="space-y-2">
                  {viewCountries.map(([cc, n]) => (
                    <div key={cc} className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase">{cc}</span>
                      <div className="flex-1 mx-3 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${(n / Math.max(1, countryTotal)) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{n}</span>
                    </div>
                  ))}
                  {viewCountries.length === 0 && (
                    <p className="text-xs text-ink-muted">Keine Daten</p>
                  )}
                </div>
              </div>

              {/* Devices */}
              <div className="card p-5">
                <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                  <MonitorSmartphone className="size-4 text-brand" /> Geräte
                </p>
                <div className="space-y-2">
                  {viewDevices.map(([dev, n]) => {
                    const Icon = DEVICE_ICONS[dev as keyof typeof DEVICE_ICONS] ?? Monitor;
                    return (
                      <div key={dev} className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium flex items-center gap-1.5 capitalize">
                          <Icon className="size-3.5 text-ink-muted" /> {dev}
                        </span>
                        <div className="flex-1 mx-3 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${(n / Math.max(1, deviceTotal)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums">{n}</span>
                      </div>
                    );
                  })}
                  {viewDevices.length === 0 && (
                    <p className="text-xs text-ink-muted">Keine Daten</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
