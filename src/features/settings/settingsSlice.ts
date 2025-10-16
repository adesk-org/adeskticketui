import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
    ticketsvcBaseUrl: string;
    token: string;
    tenantId: string;
}

const initial: SettingsState = {
    ticketsvcBaseUrl: "http://localhost:8080",
    token: localStorage.getItem("token") ?? "",
    tenantId: localStorage.getItem("tenantId") ?? "",
};

const slice = createSlice({
    name: "settings",
    initialState: initial,
    reducers: {
        setBaseUrl(state, action) {
            state.ticketsvcBaseUrl = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setTenantId(state, action) {
            state.tenantId = action.payload;
            localStorage.setItem("tenantId", action.payload);
        },
    },
});

export const { setBaseUrl, setToken, setTenantId } = slice.actions;
export default slice.reducer;
