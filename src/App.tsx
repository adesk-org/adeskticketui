import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import TicketPage from "./pages/TicketPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<TicketPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
