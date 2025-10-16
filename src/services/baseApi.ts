import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const baseApi = createApi({
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const isDev: boolean = import.meta.env.DEV;
        const ticketsvcBaseUrl: string = isDev
            ? "/api"
            : state.settings.ticketsvcBaseUrl;
        return fetchBaseQuery({
            baseUrl: ticketsvcBaseUrl,
            prepareHeaders: (headers) => {
                const token = state.settings.token;
                const tenantId = state.settings.tenantId;
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                if (tenantId) {
                    headers.set("X-Tenant-Id", tenantId);
                }
                headers.set("Content-Type", "application/json");
                return headers;
            },
        })(args, api, extraOptions);
    },
    endpoints: () => ({}),
});
