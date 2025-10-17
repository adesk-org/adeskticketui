import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./appLayout.css";

export default function AppLayout() {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
