import { NavLink } from "react-router-dom";

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
