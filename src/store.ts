import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settings/settingsSlice";
import { baseApi } from "./services/baseApi";

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (gDM) => gDM().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
