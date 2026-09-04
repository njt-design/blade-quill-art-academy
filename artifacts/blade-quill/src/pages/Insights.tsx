import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";
import { QuillMark } from "@/components/site/QuillMark";
import { Btn } from "@/components/site/Btn";
import {
  adminLoginUrl,
  establishInsightsSession,
  getTinaClientId,
  getTinaIdToken,
  hasTinaSession,
  subscribeTinaAuthHandoff,
} from "@/lib/tina-auth";

type RangeDays = 7 | 28 | 90;

interface InsightsOrder {
  id: number;
  productName: string | null;
  productSlug: string | null;
  customerEmail: string | null;
  status: string;
  createdAt: string;
}

interface InsightsPayload {
  rangeDays: RangeDays;
  startDate: string;
  endDate: string;
  sessions: number;
  bounceRate: number | null;
  stripeSales: number;
  amazonClicks: number;
  dummyBookRequests: number;
  gaPurchaseEvents: number;
  sessionsByDay: Array<{ date: string; sessions: number }>;
  recentOrders: InsightsOrder[];
  gaConfigured: boolean;
  warnings: string[];
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatPct(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(1)}%`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function shortDay(date: string): string {
  try {
    return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

async function fetchInsights(range: RangeDays): Promise<InsightsPayload> {
  const token = getTinaIdToken();
  const clientId = getTinaClientId();
  const params = new URLSearchParams({
    range: String(range),
    ...(clientId ? { clientID: clientId } : {}),
  });
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/insights?${params}`, {
    credentials: "include",
    headers,
  });
  if (res.status === 401) {
    throw new Error(
      token
        ? "Tina session expired or was rejected. Sign in again at /admin, then reopen Insights."
        : "Sign in with Tina to view Insights"
    );
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "Failed to load insights");
  }
  return res.json() as Promise<InsightsPayload>;
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(46,34,34,0.08)",
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.14em] mb-2"
        style={{ color: "var(--ink-mute)", fontFamily: "var(--f-sans)" }}
      >
        {label}
      </div>
      <div
        className="text-3xl leading-none"
        style={{ fontFamily: "var(--f-serif)", color: "var(--ink)" }}
      >
        {value}
      </div>
      {hint ? (
        <div
          className="text-[12px] mt-2"
          style={{ color: "var(--ink-faint)", fontFamily: "var(--f-sans)" }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export default function Insights() {
  const [authed, setAuthed] = useState(() => hasTinaSession());
  const [range, setRange] = useState<RangeDays>(28);
  const [data, setData] = useState<InsightsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const syncAuth = () => setAuthed(hasTinaSession());
    syncAuth();

    const unsub = subscribeTinaAuthHandoff((token) => {
      setAuthed(Boolean(token) || hasTinaSession());
      if (token) void establishInsightsSession(token);
    });

    const existing = getTinaIdToken();
    let timer: number | undefined;

    if (existing) {
      void establishInsightsSession(existing).finally(() => {
        syncAuth();
        setAuthReady(true);
      });
    } else {
      // Wait briefly for Tina parent frame to postMessage a token.
      timer = window.setTimeout(() => {
        syncAuth();
        setAuthReady(true);
      }, 500);
    }

    window.addEventListener("focus", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      if (timer) window.clearTimeout(timer);
      unsub();
      window.removeEventListener("focus", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Always attempt the API once ready — cookie alone may authenticate
    // even when localStorage looks empty.
    fetchInsights(range)
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setAuthed(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load insights";
        setError(message);
        // Only show the login gate when we truly have no client token
        // AND the server rejected us. Keep the dashboard chrome otherwise.
        if (!getTinaIdToken() && /sign in with tina/i.test(message)) {
          setAuthed(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authReady, range]);

  if (!authReady || (loading && !data)) {
    return (
      <div
        className="min-h-screen flex items-center justify-center gap-3"
        style={{
          background: "var(--paper)",
          color: "var(--ink-mute)",
          fontFamily: "var(--f-sans)",
        }}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading Insights…
      </div>
    );
  }

  if (!authed && !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% -10%, rgba(176,74,58,0.12), transparent), radial-gradient(900px 500px at 90% 10%, rgba(196,154,74,0.14), transparent), var(--paper)",
        }}
      >
        <div className="max-w-md w-full text-center">
          <div
            className="mx-auto mb-6 grid place-items-center rounded-[14px]"
            style={{
              width: 56,
              height: 56,
              background: "var(--g-cta)",
            }}
          >
            <QuillMark size={28} color="var(--paper)" />
          </div>
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "var(--f-serif)", color: "var(--ink)" }}
          >
            Owner Insights
          </h1>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--ink-mute)", fontFamily: "var(--f-sans)" }}
          >
            Sign in with TinaCMS to see sessions, bounce rate, Stripe sales, and
            conversion glances for Blade &amp; Quill.
          </p>
          <Btn
            href={adminLoginUrl("/insights")}
            target="_top"
            iconRight={<ArrowUpRight className="w-4 h-4" />}
          >
            Sign in with Tina
          </Btn>
          <p
            className="text-xs mt-5"
            style={{ color: "var(--ink-faint)", fontFamily: "var(--f-sans)" }}
          >
            After logging in at /admin, open Insights again from the Tina
            sidebar — or visit /insights directly. Your session stays on this
            site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -20%, rgba(176,74,58,0.1), transparent), radial-gradient(800px 420px at 100% 0%, rgba(196,154,74,0.12), transparent), var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--f-sans)",
      }}
    >
      <header
        className="border-b"
        style={{ borderColor: "rgba(46,34,34,0.08)" }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid place-items-center rounded-[12px]"
              style={{ width: 42, height: 42, background: "var(--g-cta)" }}
            >
              <QuillMark size={22} color="var(--paper)" />
            </span>
            <div>
              <div
                className="text-xl leading-tight"
                style={{ fontFamily: "var(--f-serif)" }}
              >
                Owner Insights
              </div>
              <div className="text-xs" style={{ color: "var(--ink-mute)" }}>
                Analytics + Stripe orders
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Btn
              kind="outline"
              size="sm"
              href={`${import.meta.env.BASE_URL}admin/index.html`}
              iconLeft={<Package className="w-3.5 h-3.5" />}
            >
              Edit products in Tina
            </Btn>
            <Btn
              kind="outline"
              size="sm"
              aria-label="Refresh"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchInsights(range)
                  .then(setData)
                  .catch((err: unknown) =>
                    setError(
                      err instanceof Error ? err.message : "Failed to refresh"
                    )
                  )
                  .finally(() => setLoading(false));
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Btn>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--maroon)" }}
            >
              Glance
            </div>
            <h1
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "var(--f-serif)" }}
            >
              How the studio is doing
            </h1>
            {data ? (
              <p className="text-sm mt-2" style={{ color: "var(--ink-mute)" }}>
                {formatDate(data.startDate)} – {formatDate(data.endDate)}
              </p>
            ) : null}
          </div>
          <div
            className="inline-flex rounded-full p-1"
            style={{
              background: "rgba(46,34,34,0.05)",
              border: "1px solid rgba(46,34,34,0.08)",
            }}
            role="group"
            aria-label="Date range"
          >
            {([7, 28, 90] as RangeDays[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRange(d)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: range === d ? "var(--ink)" : "transparent",
                  color: range === d ? "var(--paper)" : "var(--ink-mute)",
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div
            className="mb-6 rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(176,74,58,0.08)",
              color: "var(--maroon)",
              border: "1px solid rgba(176,74,58,0.2)",
            }}
          >
            {error}
          </div>
        ) : null}

        {data?.warnings?.length ? (
          <div
            className="mb-6 rounded-xl px-4 py-3 text-sm space-y-1"
            style={{
              background: "rgba(196,154,74,0.12)",
              color: "var(--ink)",
              border: "1px solid rgba(196,154,74,0.28)",
            }}
          >
            {data.warnings.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
        ) : null}

        {loading && !data ? (
          <div className="flex items-center justify-center py-24 gap-3" style={{ color: "var(--ink-mute)" }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading metrics…
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
              <Kpi label="Sessions" value={formatNumber(data.sessions)} />
              <Kpi
                label="Bounce rate"
                value={formatPct(data.bounceRate)}
                hint="GA4"
              />
              <Kpi
                label="Stripe sales"
                value={formatNumber(data.stripeSales)}
                hint="Paid orders"
              />
              <Kpi
                label="Amazon clicks"
                value={formatNumber(data.amazonClicks)}
                hint="Outbound"
              />
              <Kpi
                label="Dummy book"
                value={formatNumber(data.dummyBookRequests)}
                hint="Publisher requests"
              />
            </div>

            <div
              className="rounded-2xl p-5 md:p-6 mb-8"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(46,34,34,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4" style={{ color: "var(--maroon)" }} />
                <h2
                  className="text-lg"
                  style={{ fontFamily: "var(--f-serif)" }}
                >
                  Sessions over time
                </h2>
              </div>
              {data.sessionsByDay.length === 0 ? (
                <p className="text-sm py-10 text-center" style={{ color: "var(--ink-mute)" }}>
                  {data.gaConfigured
                    ? "No session data in this range yet."
                    : "Connect GA4 Data API credentials to see the trend."}
                </p>
              ) : (
                <div className="h-56 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sessionsByDay}>
                      <defs>
                        <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B04A3A" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#B04A3A" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(46,34,34,0.06)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={shortDay}
                        tick={{ fill: "var(--ink-faint)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={28}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "var(--ink-faint)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={36}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(46,34,34,0.1)",
                          fontFamily: "var(--f-sans)",
                          fontSize: 12,
                        }}
                        labelFormatter={(label) => shortDay(String(label))}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#B04A3A"
                        strokeWidth={2}
                        fill="url(#sessionsFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(46,34,34,0.08)",
              }}
            >
              <div className="px-5 md:px-6 py-4 flex items-center justify-between gap-3 border-b" style={{ borderColor: "rgba(46,34,34,0.06)" }}>
                <h2 className="text-lg" style={{ fontFamily: "var(--f-serif)" }}>
                  Recent orders
                </h2>
                <span className="text-xs" style={{ color: "var(--ink-faint)" }}>
                  From Stripe / Supabase
                </span>
              </div>
              {data.recentOrders.length === 0 ? (
                <p className="text-sm px-5 py-10 text-center" style={{ color: "var(--ink-mute)" }}>
                  No orders in this range.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-left text-[11px] uppercase tracking-[0.12em]"
                        style={{ color: "var(--ink-faint)" }}
                      >
                        <th className="px-5 md:px-6 py-3 font-medium">Product</th>
                        <th className="px-3 py-3 font-medium">Customer</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-5 md:px-6 py-3 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          style={{ borderTop: "1px solid rgba(46,34,34,0.06)" }}
                        >
                          <td className="px-5 md:px-6 py-3">
                            {order.productName || "Untitled product"}
                          </td>
                          <td className="px-3 py-3" style={{ color: "var(--ink-mute)" }}>
                            {order.customerEmail || "—"}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-wide"
                              style={{
                                background:
                                  order.status === "paid"
                                    ? "rgba(46,120,72,0.12)"
                                    : "rgba(46,34,34,0.06)",
                                color:
                                  order.status === "paid"
                                    ? "#2E7848"
                                    : "var(--ink-mute)",
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td
                            className="px-5 md:px-6 py-3 text-right"
                            style={{ color: "var(--ink-mute)" }}
                          >
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
