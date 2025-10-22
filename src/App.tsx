import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import TicketMonitor from "./pages/TicketMonitor";
import TicketPage from "./pages/TicketPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<TicketPage />} />
                    <Route path="/monitor" element={<TicketMonitor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
