import { baseApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    listTickets: build.query<ListTicketsApiResponse, ListTicketsApiArg>({
      query: (queryArg) => ({
        url: `/tickets`,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
        params: {
          limit: queryArg.limit,
          offset: queryArg.offset,
          status: queryArg.status,
          assignee: queryArg.assignee,
        },
      }),
    }),
    createTicket: build.mutation<CreateTicketApiResponse, CreateTicketApiArg>({
      query: (queryArg) => ({
        url: `/tickets`,
        method: "POST",
        body: queryArg.ticketCreate,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    getTicket: build.query<GetTicketApiResponse, GetTicketApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}`,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    updateTicket: build.mutation<UpdateTicketApiResponse, UpdateTicketApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}`,
        method: "PATCH",
        body: queryArg.ticketUpdate,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    listNotes: build.query<ListNotesApiResponse, ListNotesApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}/notes`,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
        params: {
          limit: queryArg.limit,
          offset: queryArg.offset,
        },
      }),
    }),
    createNote: build.mutation<CreateNoteApiResponse, CreateNoteApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}/notes`,
        method: "POST",
        body: queryArg.noteCreate,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    getNote: build.query<GetNoteApiResponse, GetNoteApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}/notes/${queryArg.noteId}`,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    updateNote: build.mutation<UpdateNoteApiResponse, UpdateNoteApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}/notes/${queryArg.noteId}`,
        method: "PATCH",
        body: queryArg.noteUpdate,
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
    deleteNote: build.mutation<DeleteNoteApiResponse, DeleteNoteApiArg>({
      query: (queryArg) => ({
        url: `/tickets/${queryArg.ticketId}/notes/${queryArg.noteId}`,
        method: "DELETE",
        headers: {
          "X-Tenant-Id": queryArg["X-Tenant-Id"],
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as ticketsApi };
export type ListTicketsApiResponse =
  /** status 200 Paginated list of tickets */ TicketList;
export type ListTicketsApiArg = {
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  /** Page size (1–1000) */
  limit?: number;
  /** Items to skip */
  offset?: number;
  /** Filter by status */
  status?: TicketStatus;
  /** Filter by assignee username */
  assignee?: string | null;
};
export type CreateTicketApiResponse = /** status 201 Created */ Ticket;
export type CreateTicketApiArg = {
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  ticketCreate: TicketCreate;
};
export type GetTicketApiResponse = /** status 200 Ticket */ Ticket;
export type GetTicketApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
};
export type UpdateTicketApiResponse = /** status 200 Updated ticket */ Ticket;
export type UpdateTicketApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  ticketUpdate: TicketUpdate;
};
export type ListNotesApiResponse =
  /** status 200 List of notes (ordered by seq asc) */ NoteList;
export type ListNotesApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  /** Page size (1–1000) */
  limit?: number;
  /** Items to skip */
  offset?: number;
};
export type CreateNoteApiResponse = /** status 201 Created */ Note;
export type CreateNoteApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  noteCreate: NoteCreate;
};
export type GetNoteApiResponse = /** status 200 Note */ Note;
export type GetNoteApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Note UUID */
  noteId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
};
export type UpdateNoteApiResponse = /** status 200 Updated note */ Note;
export type UpdateNoteApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Note UUID */
  noteId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
  noteUpdate: NoteUpdate;
};
export type DeleteNoteApiResponse = unknown;
export type DeleteNoteApiArg = {
  /** Ticket UUID */
  ticketId: string;
  /** Note UUID */
  noteId: string;
  /** Tenant identifier (organization or workspace ID) */
  "X-Tenant-Id": string;
};
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
};
export type TicketList = {
  total: number;
  limit: number;
  offset: number;
  items: Ticket[];
};
export type Error = {
  detail?: string | string[];
};
export type TicketCreate = {
  title: string;
  description?: string;
  assignee?: string | null;
};
export type TicketUpdate = {
  status?: TicketStatus;
  assignee?: string | null;
};
export type Note = {
  id: string;
  ticketId: string;
  /** Monotonic per ticket (1,2,3,...) */
  seq: number;
  /** Note body text */
  content: string;
  authorName?: string | null;
  isPrivate: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
};
export type NoteList = {
  total: number;
  limit: number;
  offset: number;
  items: Note[];
};
export type NoteCreate = {
  content: string;
  authorName?: string | null;
  isPrivate?: boolean;
};
export type NoteUpdate = {
  content?: string;
  isPrivate?: boolean;
};
export const {
  useListTicketsQuery,
  useCreateTicketMutation,
  useGetTicketQuery,
  useUpdateTicketMutation,
  useListNotesQuery,
  useCreateNoteMutation,
  useGetNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = injectedRtkApi;
