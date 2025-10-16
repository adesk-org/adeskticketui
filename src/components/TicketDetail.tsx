import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import {
    useGetTicketQuery,
    useUpdateTicketMutation,
    type TicketStatus,
} from "../services/tickets.generated";

const STATUS_OPTIONS: TicketStatus[] = [
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
];

export default function TicketDetail({ ticketId }) {
    const [status, setStatus] = useState<TicketStatus | "">("");
    const [assignee, setAssignee] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    const arg = ticketId
        ? { "X-Tenant-Id": "bee1e4b2-1c7a-4944-92aa-b0dde5088c87", ticketId }
        : skipToken;
    const query = useGetTicketQuery(arg);

    useEffect(() => {
        if (query.data) {
            setStatus(query.data.status);
            setAssignee(query.data.assignee ?? "");
        }
    }, [query.data]);

    const [updateTicket, { isLoading: saving }] = useUpdateTicketMutation();

    async function save() {
        setMsg(null);
        const res = await updateTicket({
            "X-Tenant-Id": "bee1e4b2-1c7a-4944-92aa-b0dde5088c87",
            ticketId,
            ticketUpdate: {
                status: status || undefined,
                assignee: assignee === "" ? null : assignee,
            },
        });
        setMsg("data" in res ? "Saved" : "Failed to save");
        query.refetch();
    }

    return (
        <div className="form">
            <div className="kv">Title: {query.data?.title}</div>
            <div className="kv">Description: {query.data?.description}</div>

            <label>Status</label>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
            >
                {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            <label>Assignee</label>
            <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
            />

            <div className="row">
                <button onClick={save} disabled={saving}>
                    Save
                </button>
            </div>
        </div>
    );
}
