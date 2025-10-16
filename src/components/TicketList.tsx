import { useEffect, useMemo, useState } from "react";
import {
    useListTicketsQuery,
    type TicketStatus,
} from "../services/tickets.generated";

export default function TicketList({ onOpened }) {
    const [status, setStatus] = useState<TicketStatus | "">("");
    const [assignee, setAssignee] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = useMemo(() => (page - 1) * limit, [page, limit]);

    const { data, isFetching, error } = useListTicketsQuery({
        "X-Tenant-Id": "bee1e4b2-1c7a-4944-92aa-b0dde5088c87",
        limit,
        offset,
        status: status || undefined,
        assignee: assignee || undefined,
    });

    useEffect(() => {
        if (data) {
            console.log("Fetched tickets:", data);
        }
    }, [data]);

    return (
        data && (
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Assignee</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((t) => (
                        <tr key={t.id}>
                            <td>{t.title}</td>
                            <td>{t.status}</td>
                            <td>{t.assignee ?? "-"}</td>
                            <td>{new Date(t.createdAt).toLocaleString()}</td>
                            <td>{new Date(t.updatedAt).toLocaleString()}</td>
                            <td>
                                <button
                                    onClick={(e) => {
                                        // e.stopPropagation();
                                        onOpened(t.id);
                                    }}
                                >
                                    Open
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    );
}
