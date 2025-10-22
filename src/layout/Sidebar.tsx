import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div>Adesk</div>
            <nav>
                <NavLink to="/">Tickets</NavLink>
                <NavLink to="/monitor">Monitor</NavLink>
            </nav>
        </aside>
    );
}
