export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    assignee: string | null;
    created_at: string;
    updated_at: string;
}

export interface TicketCreate {
    title: string;
    description: string;
    assignee?: string | null;
}

export interface TicketUpdate {
    status?: TicketStatus;
    assignee?: string | null;
}

export interface TicketList {
    total: number;
    limit: number;
    offset: number;
    items: Ticket[];
}
