// src/pages/TicketMonitor.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useTicketModal } from "../components/TicketModalContext";

/**
 * Adjust these to your environment.
 * Example: VITE_TICKET_API="http://localhost:4000"
 */
const ticketUrl = "/api";
const isDev: boolean = import.meta.env.DEV;
const API_BASE: string = isDev ? "/realtime" : "http://localhost:8081";

/** Matches your OpenAPI schemas */
type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

type Ticket = {
    id: string;
    title: string;
    description?: string | null;
    status: TicketStatus;
    assignee?: string | null;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
};

type TicketListResponse = {
    total: number;
    limit: number;
    offset: number;
    items: Ticket[];
};

type TicketEvent =
    | {
          // e.g. "ticket.created" | "ticket.updated" | "ticket.closed"
          type: string;
          ticket: Ticket;
      }
    | {
          type: "heartbeat";
          ts: string;
      };

function getAuthToken(): string | null {
    // If you store JWT in localStorage
    return localStorage.getItem("token");
}

function isoToLocal(iso: string) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export default function TicketMonitor() {
    const [tickets, setTickets] = useState<Map<string, Ticket>>(new Map());
    const [loading, setLoading] = useState(true);
    const [sseStatus, setSseStatus] = useState<
        "connecting" | "open" | "closed"
    >("closed");
    const [error, setError] = useState<string | null>(null);

    // In your app, you likely have tenant + token available in context/store.
    const tenantId =
        localStorage.getItem("tenantId") ??
        "bee1e4b2-1c7a-4944-92aa-b0dde5088c87"; // example from your earlier code
    const token = getAuthToken();

    const ticketsArray = useMemo(() => Array.from(tickets.values()), [tickets]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const { open } = useTicketModal();

    // Initial load of tickets
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const resp = await fetch(
                    `${ticketUrl}/tickets?limit=100&offset=0`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Tenant-Id": tenantId,
                            ...(token
                                ? { Authorization: `Bearer ${token}` }
                                : {}),
                        },
                    }
                );
                if (!resp.ok) {
                    throw new Error(
                        `Failed to load tickets: ${resp.status} ${resp.statusText}`
                    );
                }
                const data = (await resp.json()) as TicketListResponse;
                if (!cancelled) {
                    const map = new Map<string, Ticket>();
                    for (const t of data.items) map.set(t.id, t);
                    setTickets(map);
                }
            } catch (e: any) {
                if (!cancelled)
                    setError(e?.message ?? "Unknown error fetching tickets");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [tenantId, token]);

    // Live updates via SSE
    useEffect(() => {
        const qs = new URLSearchParams();
        if (tenantId) qs.set("tenantId", tenantId);
        if (token) qs.set("token", token);

        const url = `${API_BASE}/stream?${qs.toString()}`;

        setSseStatus("connecting");
        const es = new EventSource(url, { withCredentials: false });
        eventSourceRef.current = es;

        es.onopen = () => {
            console.log("[SSE] open", url);
            setSseStatus("open");
        };

        es.onerror = (err) => {
            console.warn("[SSE] error", err);
            setSseStatus("closed"); // browser will auto-retry
        };

        // One handler you can reuse
        const handleTicketEvent = (evt: MessageEvent) => {
            console.log("[SSE] got event", evt.type, evt.data);
            if (!evt.data) return;
            try {
                const msg = JSON.parse(evt.data) as TicketEvent;

                if ((msg as any).type === "heartbeat") {
                    return;
                }

                if ("ticket" in msg && (msg as any).ticket?.id) {
                    const t = (msg as any).ticket as any;

                    const ticket: Ticket = {
                        id: t.id,
                        title: t.title,
                        description: t.description ?? null,
                        status: t.status,
                        assignee: t.assignee ?? null,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                    };

                    setTickets((prev) => {
                        const next = new Map(prev);
                        next.set(ticket.id, ticket);
                        return next;
                    });
                }
            } catch (e) {
                console.warn("[SSE] parse failed", e);
            }
        };

        // Subscribe to NAMED events emitted by the server
        es.addEventListener("ticket.created", handleTicketEvent);
        es.addEventListener("ticket.updated", handleTicketEvent);
        es.addEventListener("ticket.closed", handleTicketEvent);
        es.addEventListener("heartbeat", (evt) => {
            // optional: update a “last heartbeat” timestamp
            console.log("[SSE] heartbeat", evt.data);
        });

        // (Optional) also subscribe to default 'message' in case server sends some
        es.onmessage = (evt) => {
            console.log("[SSE] default message", evt.data);
            handleTicketEvent(evt);
        };

        return () => {
            es.close();
            eventSourceRef.current = null;
            setSseStatus("closed");
        };
    }, [tenantId, token]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <header
                style={{ display: "flex", alignItems: "baseline", gap: 12 }}
            >
                <h1 style={{ margin: 0 }}>Live Ticket Monitor</h1>
                <span
                    title={
                        sseStatus === "open"
                            ? "Connected to live stream"
                            : sseStatus === "connecting"
                              ? "Connecting…"
                              : "Disconnected (auto-retrying)"
                    }
                    style={{
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background:
                            sseStatus === "open"
                                ? "#e7f7ee"
                                : sseStatus === "connecting"
                                  ? "#fff7e6"
                                  : "#fdecea",
                        color:
                            sseStatus === "open"
                                ? "#0a7a3e"
                                : sseStatus === "connecting"
                                  ? "#8a6d1d"
                                  : "#a61b1b",
                        border:
                            sseStatus === "open"
                                ? "1px solid #bae5c6"
                                : sseStatus === "connecting"
                                  ? "1px solid #ffe0a3"
                                  : "1px solid #f5b5b5",
                    }}
                >
                    {sseStatus === "open"
                        ? "LIVE"
                        : sseStatus === "connecting"
                          ? "CONNECTING"
                          : "DISCONNECTED"}
                </span>
            </header>

            {loading && <p>Loading tickets…</p>}
            {error && <p style={{ color: "#a61b1b" }}>{error}</p>}

            {!loading && !ticketsArray.length && !error && (
                <p>No tickets yet. Waiting for live updates…</p>
            )}

            {!!ticketsArray.length && (
                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: 14,
                        }}
                    >
                        <thead style={{ background: "#f9fafb" }}>
                            <tr>
                                <Th>ID</Th>
                                <Th>Title</Th>
                                <Th>Status</Th>
                                <Th>Assignee</Th>
                                <Th>Updated</Th>
                                <Th>Created</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketsArray
                                .slice()
                                .sort((a, b) =>
                                    b.updatedAt.localeCompare(a.updatedAt)
                                )
                                .map((t) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => open(t.id)}
                                        style={{
                                            borderTop: "1px solid #f1f1f1",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <Td mono title={t.id}>
                                            {t.id}
                                        </Td>
                                        <Td>{t.title}</Td>
                                        <Td>
                                            <StatusPill status={t.status} />
                                        </Td>
                                        <Td>{t.assignee ?? "—"}</Td>
                                        <Td>{isoToLocal(t.updatedAt)}</Td>
                                        <Td>{isoToLocal(t.createdAt)}</Td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/** Simple presentational bits */
function Th({ children }: { children: React.ReactNode }) {
    return (
        <th
            style={{
                textAlign: "left",
                fontWeight: 600,
                padding: "10px 12px",
                borderBottom: "1px solid #e5e7eb",
            }}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    mono,
    title,
}: {
    children: React.ReactNode;
    mono?: boolean;
    title?: string;
}) {
    return (
        <td
            title={title}
            style={{
                padding: "10px 12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: mono
                    ? "ui-monospace, SFMono-Regular, Menlo, monospace"
                    : undefined,
            }}
        >
            {children}
        </td>
    );
}

function StatusPill({ status }: { status: TicketStatus }) {
    const { bg, bd, fg } = (() => {
        switch (status) {
            case "OPEN":
                return { bg: "#e8f3ff", bd: "#cfe5ff", fg: "#0b63ce" };
            case "IN_PROGRESS":
                return { bg: "#fff7e6", bd: "#ffe0a3", fg: "#8a6d1d" };
            case "RESOLVED":
                return { bg: "#e7f7ee", bd: "#bae5c6", fg: "#0a7a3e" };
            case "CLOSED":
                return { bg: "#f3f4f6", bd: "#e5e7eb", fg: "#374151" };
            default:
                return { bg: "#f3f4f6", bd: "#e5e7eb", fg: "#374151" };
        }
    })();

    return (
        <span
            style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 999,
                background: bg,
                color: fg,
                border: `1px solid ${bd}`,
            }}
        >
            {status.replace("_", " ")}
        </span>
    );
}
