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
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
export type TicketList = {
  total: number;
  limit: number;
  offset: number;
  items: Ticket[];
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
export const {
  useListTicketsQuery,
  useCreateTicketMutation,
  useGetTicketQuery,
  useUpdateTicketMutation,
} = injectedRtkApi;
