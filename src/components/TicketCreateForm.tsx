import { useState } from "react";
import { useCreateTicketMutation } from "../services/tickets.generated";

export default function TicketCreateForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    const [createTicket, { isLoading, error }] = useCreateTicketMutation();

    async function submit() {
        setMsg(null);
        const res = await createTicket({
            "X-Tenant-Id": "bee1e4b2-1c7a-4944-92aa-b0dde5088c87",
            ticketCreate: {
                title,
                description,
                assignee: assignee ?? undefined,
            },
        });
        if (res.data) {
            setMsg(`Created ${res.data?.id}`);
            setTitle("");
            setDescription("");
            setAssignee("");
        } else {
            setMsg(`Failed to create`);
        }
    }
    return (
        <div className="form">
            {msg && <div className={"success"}>{msg}</div>}
            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            ></input>
            <textarea
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <input
                placeholder="Assignee (optional)"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
            ></input>
            <button disabled={isLoading || !title} onClick={submit}>
                Create
            </button>
        </div>
    );
}
