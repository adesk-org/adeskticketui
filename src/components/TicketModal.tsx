import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
    useCreateNoteMutation,
    useGetTicketQuery,
    useListNotesQuery,
    type Note,
} from "../services/tickets.generated";
import TicketDetail from "./TicketDetail";
import "./ticketModal.css";

const DEFAULT_TENANT_ID = "bee1e4b2-1c7a-4944-92aa-b0dde5088c87";

type TicketModalProps = {
    ticketId: string;
    onRequestClose: () => void;
};

export default function TicketModal({
    ticketId,
    onRequestClose,
}: TicketModalProps) {
    const ticketArg = useMemo(
        () =>
            ticketId
                ? {
                      "X-Tenant-Id": DEFAULT_TENANT_ID,
                      ticketId,
                  }
                : skipToken,
        [ticketId]
    );

    const notesArg = useMemo(
        () =>
            ticketId
                ? {
                      "X-Tenant-Id": DEFAULT_TENANT_ID,
                      ticketId,
                      limit: 100,
                      offset: 0,
                  }
                : skipToken,
        [ticketId]
    );

    const { data: ticket, isFetching: ticketLoading } =
        useGetTicketQuery(ticketArg);
    const {
        data: notes,
        isFetching: notesLoading,
        refetch: refetchNotes,
    } = useListNotesQuery(notesArg);

    useEffect(() => {
        console.log(notes);
        console.log(notes?.items);
    }, [notes]);

    const [createNote, { isLoading: creatingNote }] = useCreateNoteMutation();
    const [noteDraft, setNoteDraft] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onRequestClose();
            }
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [onRequestClose]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        const trimmed = noteDraft.trim();
        if (!trimmed) {
            setErrorMessage("Note cannot be empty");
            return;
        }

        try {
            await createNote({
                "X-Tenant-Id": DEFAULT_TENANT_ID,
                ticketId,
                noteCreate: {
                    content: trimmed,
                    authorName: "Test Author",
                    isPrivate: false,
                },
            }).unwrap();
            setNoteDraft("");
            await refetchNotes();
        } catch {
            setErrorMessage("Failed to add note");
        }
    }

    const modalContent = (
        <div
            className="ticket-modal__backdrop"
            role="presentation"
            onClick={onRequestClose}
        >
            <div
                className="ticket-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ticket-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="ticket-modal__close"
                    aria-label="Close ticket details"
                    onClick={onRequestClose}
                >
                    ×
                </button>
                <div className="ticket-modal__layout">
                    <section className="ticket-modal__section ticket-modal__sidebar">
                        <h3 id="ticket-modal-title">Sidebar</h3>
                        {ticketLoading && <p>Loading ticket…</p>}
                        {!ticketLoading && ticket && (
                            <dl className="ticket-modal__meta">
                                <div>
                                    <dt>ID</dt>
                                    <dd title={ticket.id}>{ticket.id}</dd>
                                </div>
                                <div>
                                    <dt>Status</dt>
                                    <dd>{ticket.status}</dd>
                                </div>
                                <div>
                                    <dt>Assignee</dt>
                                    <dd>{ticket.assignee ?? "Unassigned"}</dd>
                                </div>
                                <div>
                                    <dt>Created</dt>
                                    <dd>
                                        {new Date(
                                            ticket.createdAt
                                        ).toLocaleString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Updated</dt>
                                    <dd>
                                        {new Date(
                                            ticket.updatedAt
                                        ).toLocaleString()}
                                    </dd>
                                </div>
                            </dl>
                        )}
                    </section>
                    <section className="ticket-modal__section ticket-modal__fields">
                        <h3>Ticket Fields</h3>
                        <TicketDetail ticketId={ticketId} />
                    </section>
                    <section className="ticket-modal__section ticket-modal__notes">
                        <h3>Notes</h3>
                        {(notesLoading || !notes?.items) && (
                            <p>Loading notes…</p>
                        )}
                        {!(notesLoading || !notes?.items) && (
                            <div className="ticket-modal__notes-list">
                                {notes?.items.length ? (
                                    notes.items.map((note: Note) => (
                                        <article
                                            key={note.id}
                                            className="ticket-modal__note"
                                        >
                                            <header>
                                                <span>
                                                    {note.authorName ??
                                                        "Unknown author"}
                                                </span>
                                                <time dateTime={note.createdAt}>
                                                    {new Date(
                                                        note.createdAt
                                                    ).toLocaleString()}
                                                </time>
                                            </header>
                                            <p>{note.content}</p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="ticket-modal__empty">
                                        No notes yet.
                                    </p>
                                )}
                            </div>
                        )}
                        <form
                            className="ticket-modal__add-note"
                            onSubmit={handleAddNote}
                        >
                            <textarea
                                value={noteDraft}
                                onChange={(event) =>
                                    setNoteDraft(event.target.value)
                                }
                                placeholder="Add a note"
                                rows={3}
                            />
                            {errorMessage && (
                                <p className="ticket-modal__error">
                                    {errorMessage}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={creatingNote}
                                className="ticket-modal__add-note-button"
                            >
                                {creatingNote ? "Saving…" : "Add Note"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
