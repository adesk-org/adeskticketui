import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseApi = createApi({
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const baseUrl = state.settings.baseUrl;
        return fetchBaseQuery({
            baseUrl,
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
